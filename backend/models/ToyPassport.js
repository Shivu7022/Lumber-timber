const mongoose = require('mongoose');

const ToyPassportSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  toy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Toy',
    required: true
  },
  history: [{
    event: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String, required: true }
  }],
  artisan: {
    name: String,
    location: String
  },
  ecoImpact: {
    co2Saved: String,
    plasticAvoided: String,
    treesPlanted: Number
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ToyPassport', ToyPassportSchema);
