const express = require('express');
const Repair = require('../models/Repair');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin: Get all repairs
router.get('/all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    const repairs = await Repair.find().populate('toy').populate('user', 'name email').sort({ dateRequested: -1 });
    res.json(repairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user repairs
router.get('/', auth, async (req, res) => {
  try {
    const repairs = await Repair.find({ user: req.user.id }).populate('toy');
    res.json(repairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create repair or return request
router.post('/', auth, async (req, res) => {
  const { toyId, issue, description, requestType = 'repair' } = req.body;

  try {
    const repair = new Repair({
      user: req.user.id,
      toy: toyId,
      issue,
      description,
      requestType
    });

    await repair.save();
    res.json(repair);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update repair status (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, creditAmount } = req.body;
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Assign credits if this is a completed return request
    if (status === 'completed' && repair.requestType === 'return' && repair.status !== 'completed') {
      if (creditAmount && creditAmount > 0) {
        const user = await User.findById(repair.user);
        if (user) {
          user.creditBalance = (user.creditBalance || 0) + Number(creditAmount);
          await user.save();
        }
      }
    }

    repair.status = status || repair.status;
    if (status === 'completed') {
      repair.dateCompleted = Date.now();
    }
    
    await repair.save();
    res.json(repair);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;