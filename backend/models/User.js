const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  },
  creditBalance: {
    type: Number,
    default: 0
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Toy'
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);