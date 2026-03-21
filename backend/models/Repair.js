const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Toy',
    required: true
  },
  requestType: {
    type: String,
    enum: ['repair', 'return'],
    default: 'repair'
  },
  issue: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'completed', 'rejected']
  },
  cost: {
    type: Number
  },
  dateRequested: {
    type: Date,
    default: Date.now
  },
  dateCompleted: {
    type: Date
  }
});

module.exports = mongoose.model('Repair', RepairSchema);