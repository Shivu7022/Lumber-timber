const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toys: [{
    toy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Toy'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  orderType: {
    type: String,
    enum: ['BUY', 'ADOPT', 'SUBSCRIPTION'],
    default: 'BUY'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);