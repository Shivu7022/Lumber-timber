const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lumber-timber', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const email = 'admin@lumbertimber.com';
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      name: 'Admin User',
      email: email,
      password: hashedPassword,
      role: 'admin',
      creditBalance: 1000 // give admin some credits for testing if needed
    });
    
    await adminUser.save();
    console.log('Admin user successfully created!');
    console.log('Login: ' + email);
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

createAdmin();
