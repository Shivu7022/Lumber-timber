const express = require('express');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/coupons/validate
// @desc    Validate a coupon code and get discount
// @access  Private
router.post('/validate', auth, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ msg: 'Please provide a coupon code' });
  }

  try {
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ msg: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ msg: 'This coupon has expired or is inactive' });
    }

    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
