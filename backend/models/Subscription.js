const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium']
  },
  duration: {
    type: Number, // in months
    required: true
  },
  status: {
    type: String,
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);