const express = require('express');
const User = require('../models/User');
const Toy = require('../models/Toy');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wishlist/toggle/:toyId
// @desc    Add or remove toy from wishlist
// @access  Private
router.post('/toggle/:toyId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const toyId = req.params.toyId;
    const toyIndex = user.wishlist.findIndex(id => id.toString() === toyId);

    if (toyIndex > -1) {
      // Remove from wishlist if it exists
      user.wishlist.splice(toyIndex, 1);
      await user.save();
      return res.json({ msg: 'Removed from wishlist', isWishlisted: false, wishlist: user.wishlist });
    } else {
      // Add to wishlist if it doesn't exist
      user.wishlist.push(toyId);
      await user.save();
      return res.json({ msg: 'Added to wishlist', isWishlisted: true, wishlist: user.wishlist });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
