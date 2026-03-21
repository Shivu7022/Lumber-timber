const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Toy = require('./models/Toy');
const Coupon = require('./models/Coupon');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Seed data if empty or forced reset
const seedToys = async () => {
  try {
    // Force reset for new Channapatna data
    await Toy.deleteMany({});
    
    const count = await Toy.countDocuments();
    if (count === 0) {
      const sampleToys = require('./seedData.json');
      await Toy.insertMany(sampleToys);
      console.log('Seeded actual Channapatna toys into MongoDB');
    }
  } catch (err) {
    console.error('Error seeding toys', err);
  }
};

// Seed default coupons
const seedCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      const sampleCoupons = [
        { code: 'ECO10', discountPercentage: 10, isActive: true },
        { code: 'WELCOME20', discountPercentage: 20, isActive: true },
        { code: 'EXPIRED50', discountPercentage: 50, isActive: false }
      ];
      await Coupon.insertMany(sampleCoupons);
      console.log('Seeded sample coupons into MongoDB');
    }
  } catch (err) {
     console.error('Error seeding coupons', err);
  }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lumber-timber', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  await seedToys();
  await seedCoupons();
})
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/toys', require('./routes/toys'));
app.use('/api/external', require('./routes/external'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/repairs', require('./routes/repairs'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/coupons', require('./routes/coupons'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});