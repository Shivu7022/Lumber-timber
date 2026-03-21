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

// Create repair request
router.post('/', auth, async (req, res) => {
  const { toyId, issue, description } = req.body;

  try {
    const repair = new Repair({
      user: req.user.id,
      toy: toyId,
      issue,
      description
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
    const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(repair);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;