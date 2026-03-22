const express = require('express');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
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
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    const subscription = new Subscription({
      user: req.user.id,
      plan,
      duration,
      startDate,
      endDate
    });

    await subscription.save();

    // Create in-app notification
    try {
      await Notification.create({
        user: req.user.id,
        title: '🎁 Subscription Activated!',
        message: `Welcome to the ${plan}! Your subscription is active until ${endDate.toLocaleDateString()}.`,
        type: 'subscription',
        link: '/dashboard'
      });
    } catch (_) {}

    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;