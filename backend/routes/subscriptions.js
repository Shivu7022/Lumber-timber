const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user subscriptions
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create subscription
router.post('/', auth, async (req, res) => {
  const { plan, duration } = req.body;

  try {
    const subscription = new Subscription({
      user: req.user.id,
      plan,
      duration
    });

    await subscription.save();
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;