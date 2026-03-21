const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpHash: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // Automatically deletes the document after 5 minutes (300 seconds)
  }
});

module.exports = mongoose.model('Otp', OtpSchema);
