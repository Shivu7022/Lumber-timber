const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'repair', 'subscription', 'resell', 'wishlist', 'general'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: '/dashboard'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
