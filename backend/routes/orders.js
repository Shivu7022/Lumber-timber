const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Return = require('../models/Return');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const router = express.Router();

// Admin: Get all orders
router.get('/all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    const orders = await Order.find().populate('toys.toy').populate('user', 'name email').sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    
    // Send email notification
    if (order.user && order.user.email) {
       await sendEmail(
         order.user.email,
         "Order Status Update - Lumber Timber",
         `<h2>Your order status has been updated!</h2><p>Your order (ID: ${order._id}) is now: <strong>${status}</strong>.</p>`
       );
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('toys.toy');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ALIAS: Get user orders (Specific Prompt Requirement)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('toys.toy');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  const { toys, totalAmount, paymentMethod } = req.body;

  try {
    const order = new Order({
      user: req.user.id,
      toys,
      totalAmount,
      paymentMethod
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ALIAS: Create order (Specific Prompt Requirement)
router.post('/create', auth, async (req, res) => {
  const { toys, totalAmount, paymentMethod, orderType } = req.body;

  try {
    const order = new Order({
      user: req.user.id,
      toys,
      totalAmount,
      paymentMethod,
      orderType: orderType || 'BUY'
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ALIAS: Update order status (Specific Prompt Requirement)
router.put('/update-status/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    
    if (order.user && order.user.email) {
       await sendEmail(
         order.user.email,
         "Order Status Update - Lumber Timber",
         `<h2>Your order status has been updated!</h2><p>Your order (ID: ${order._id}) is now: <strong>${status}</strong>.</p>`
       );
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ALIAS: Payment success (Specific Prompt Requirement)
router.post('/payment-success', auth, async (req, res) => {
  const { orderId, paymentId } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { 
      paymentStatus: 'Success',
      status: 'Processing'
    }, { new: true });
    
    res.json({ msg: "Payment status updated", order });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// RETURN: Initiate a return and grant Eco Credits
router.post('/return/:id', auth, async (req, res) => {
  const { reason, condition } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id) {
       return res.status(404).json({ msg: 'Order not found' });
    }

    // Create a new Return document
    const returnRequest = new Return({
      order: order._id,
      user: req.user.id,
      reason,
      condition
    });

    // Update Wallet Credits automatically for this demo feature
    const user = await User.findById(req.user.id);
    const creditsToAward = Math.floor(order.totalAmount * 0.1); // 10% cash back in credits
    
    user.creditBalance += creditsToAward;
    returnRequest.creditsEarned = creditsToAward;
    returnRequest.status = 'Approved'; 
    
    order.status = 'Returned';
    
    await returnRequest.save();
    await user.save();
    await order.save();

    res.json({ msg: `Return processed! Earned ${creditsToAward} Eco Credits`, returnRequest, walletBalance: user.creditBalance });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// TRACK: Get order tracking timeline
router.get('/track/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id) {
       return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Generate functional tracking timeline logic based on status
    const timeline = [
      { status: 'Order Placed', date: order.date, completed: true },
      { status: 'Processing', date: new Date(order.date.getTime() + 86400000), completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
      { status: 'Shipped', date: new Date(order.date.getTime() + 172800000), completed: ['Shipped', 'Delivered'].includes(order.status) },
      { status: 'Out for Delivery', date: new Date(order.date.getTime() + 259200000), completed: ['Delivered'].includes(order.status) },
      { status: 'Delivered', date: new Date(order.date.getTime() + 345600000), completed: order.status === 'Delivered' }
    ];

    res.json({ orderId: order._id, currentStatus: order.status, timeline });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('toys.toy');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;