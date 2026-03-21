const mongoose = require('mongoose');

const ToySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviews: {
    type: Number,
    default: 0
  },
  images: [String],
  category: String,
  ageGroup: String,
  artisan: {
    name: String,
    location: String,
    story: String
  },
  uniqueId: {
    type: String,
    unique: true
  },
  history: [{
    event: String,
    date: Date,
    user: String
  }],
  isAdoptable: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'available'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Toy', ToySchema);