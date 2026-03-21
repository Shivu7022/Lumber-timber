const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const router = express.Router();

let razorpayInstance = null;
try {
  if (process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.log("Razorpay not fully configured");
}

// @route   POST api/payments/razorpay/order
// @desc    Create Razorpay Order
// @access  Private
router.post('/razorpay/order', auth, async (req, res) => {
  const { totalAmount, toys } = req.body;

  if (!razorpayInstance) {
    // Return a mock order for demo environments without actual keys
    return res.json({
      id: `order_mock_${Math.random().toString(36).substring(7)}`,
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
      isMock: true
    });
  }

  try {
    const options = {
      amount: totalAmount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// @route   POST api/payments/razorpay/verify
// @desc    Verify Razorpay Payment and Save DB Order
// @access  Private
router.post('/razorpay/verify', auth, async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    totalAmount,
    toys,
    isMock
  } = req.body;

  try {
    if (!isMock && process.env.RAZORPAY_KEY_SECRET !== 'your_razorpay_key_secret') {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ msg: "Invalid signature" });
      }
    }

    // Save order in database
    const newOrder = new Order({
      user: req.user.id,
      toys,
      totalAmount,
      paymentMethod: 'razorpay',
      status: 'Processing',
      paymentId: razorpayPaymentId || `pay_mock_${Date.now()}`
    });

    await newOrder.save();
    
    // Send email notification
    const user = await User.findById(req.user.id);
    if (user && user.email) {
       await sendEmail(
         user.email,
         "Your Lumber Timber Order is Confirmed!",
         `<h2>Thank you for your purchase!</h2><p>Your order for ₹${totalAmount} has been received and is now processing.</p>`
       );
    }

    res.json({ msg: "Payment verified successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/payments/phonepe/sandbox
// @desc    Create a mock PhonePe Intent/URL or process mock payment
// @access  Private
router.post('/phonepe/order', auth, async (req, res) => {
  const { totalAmount, toys } = req.body;
  // Actual PhonePe requires specific payload formatting, 
  // base64 encoding, and X-VERIFY headers.
  // Here we mock the initiation due to lack of merchant keys.
  
  try {
    const transactionId = `T${Date.now()}`;
    res.json({
      success: true,
      message: "PhonePe Intent Created",
      transactionId,
      redirectUrl: "mock_phonepe_url",
      amount: totalAmount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/payments/phonepe/verify
// @desc    Verify PhonePe mock transaction & save order
// @access  Private
router.post('/phonepe/verify', auth, async (req, res) => {
  const { transactionId, totalAmount, toys } = req.body;
  try {
    const newOrder = new Order({
      user: req.user.id,
      toys,
      totalAmount,
      paymentMethod: 'phonepe',
      status: 'Processing',
      paymentId: transactionId
    });
    
    await newOrder.save();
    
    // Send email notification
    const user = await User.findById(req.user.id);
    if (user && user.email) {
       await sendEmail(
         user.email,
         "Your Lumber Timber Order is Confirmed!",
         `<h2>Thank you for your purchase!</h2><p>Your order for ₹${totalAmount} has been received and is now processing.</p>`
       );
    }

    res.json({ msg: "PhonePe payment success", order: newOrder });
  } catch(err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
