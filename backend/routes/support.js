const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @route   POST api/support/send
// @desc    Send a message (user or admin)
// @access  Private
router.post('/send', auth, async (req, res) => {
  try {
    const { userId, message, sender } = req.body;
    
    // Check permissions
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const targetUserId = req.user.role === 'admin' ? userId : req.user.id;
    const user = await User.findById(targetUserId);

    const newMessage = new ChatMessage({
      userId: targetUserId,
      userName: user ? user.name : 'Unknown User',
      sender,
      message
    });

    const savedMessage = await newMessage.save();

    // If admin is sending the message, notify the user
    if (sender === 'admin') {
      try {
        const notification = new Notification({
          user: userId,
          title: 'New Support Message',
          message: message.length > 50 ? message.substring(0, 50) + '...' : message,
          type: 'general',
          link: '/home?chat=open'
        });
        await notification.save();
      } catch (notiErr) {
        console.error("Failed to create support notification", notiErr);
      }
    }

    res.json(savedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/messages/:userId
// @desc    Get all messages for a specific user chat
// @access  Private
router.get('/messages/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const messages = await ChatMessage.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/active-chats
// @desc    Get list of users with chat history (Admin only)
// @access  Private (Admin)
router.get('/active-chats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Get unique userIds from messages
    const activeUserIds = await ChatMessage.distinct('userId');
    const users = await User.find({ _id: { $in: activeUserIds } }).select('name email _id');
    
    // Get last message for each user
    const chatSummaries = await Promise.all(users.map(async (u) => {
      const lastMsg = await ChatMessage.findOne({ userId: u._id }).sort({ createdAt: -1 });
      return {
        user: u,
        lastMessage: lastMsg ? lastMsg.message : '',
        timestamp: lastMsg ? lastMsg.createdAt : null,
        unreadCount: await ChatMessage.countDocuments({ userId: u._id, sender: 'user', isRead: false })
      };
    }));

    res.json(chatSummaries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/support/mark-read/:userId
// @desc    Mark all user messages as read
// @access  Private (Admin)
router.put('/mark-read/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).send('Unauthorized');
    
    await ChatMessage.updateMany(
      { userId: req.params.userId, sender: 'user', isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
