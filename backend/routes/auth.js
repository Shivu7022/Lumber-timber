const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

// Generic transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo@lumbertimber.com',
    pass: process.env.EMAIL_PASS || 'demo123'
  }
});

// Rate limiter for login: max 5 requests per 15 mins
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { msg: 'Too many login attempts, please try again after 15 minutes' }
});

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', loginLimiter, [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ msg: 'A valid email address is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otp, salt);

  try {
    // Delete any existing OTP for this email to prevent spamming
    await Otp.deleteMany({ email });
    await Otp.create({ email, otpHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Failed to generate secure OTP' });
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      await transporter.sendMail({
        from: '"Lumber & Timber" <noreply@lumbertimber.com>',
        to: email,
        subject: 'Your Login OTP',
        text: `Your OTP for Lumber & Timber is: ${otp}. It expires in 5 minutes.`
      });
      console.log(`[OTP] Successfully emailed ${otp} to ${email}`);
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  } else {
    // If no real credentials, just log it forcefully for the developer
    console.log(`\n================================`);
    console.log(`[DEV MODE] Virtual Demo OTP Sent!`);
    console.log(`To: ${email}`);
    console.log(`Your Lumber & Timber OTP Code: ${otp}`);
    console.log(`================================\n`);
  }

  res.json({ 
     msg: `OTP sent successfully!`,
     mockOtp: (process.env.EMAIL_USER && process.env.EMAIL_PASS) ? null : otp 
  });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const record = await Otp.findOne({ email });
    
    if (!record) return res.status(400).json({ msg: 'No OTP requested for this email or it has expired' });
    
    if (record.attempts >= 3) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ msg: 'Maximum verification attempts exceeded. Please request a new OTP.' });
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash);
    
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      const left = 3 - record.attempts;
      if (left === 0) {
         await Otp.deleteOne({ email });
         return res.status(400).json({ msg: 'Maximum verification attempts exceeded. Please request a new OTP.' });
      }
      return res.status(400).json({ msg: `Invalid OTP code. Attempts remaining: ${left}` });
    }

    await Otp.deleteOne({ email }); // clear after successful use

    // Login or Register mock
    let user = await User.findOne({ email });
    if (!user) {
      // Auto-register them on first OTP success to allow smooth login flow
      user = new User({ name: 'OTP User', email, password: await bcrypt.hash(otp, 10) });
      await user.save();
    }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Seed Admin
router.get('/seed-admin', async (req, res) => {
  try {
    let admin = await User.findOne({ email: 'admin@lumbertimber.com' });
    if (admin) return res.json({ msg: 'Admin already seeded. Login with admin@lumbertimber.com / admin123' });
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    
    admin = new User({
      name: 'Super Admin',
      email: 'admin@lumbertimber.com',
      password: password,
      role: 'admin'
    });
    
    await admin.save();
    res.json({ msg: 'Admin successfully seeded! Try logging in.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;