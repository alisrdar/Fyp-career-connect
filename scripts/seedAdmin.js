// scripts/seedAdmin.js
// Script to create an admin user in the database
// Run with: node scripts/seedAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sardarcluster.heu2hii.mongodb.net/careerconnect';

// Admin credentials - CHANGE THESE BEFORE RUNNING
const ADMIN_CREDENTIALS = {
  name: 'Admin User',
  email: 'admin@careerconnect.com',
  password: 'Admin@123456', // Change this to a secure password
  isAdmin: true,
  isVerified: true,
  demographic: 'adult'
};

// User Schema (simplified - must match your User model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  age: { type: Number, default: null },
  demographic: {
    type: String,
    enum: ["middle_school", "high_school", "adult", ""],
    default: "adult"
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", ""],
    default: ""
  },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  currentAbility: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', ADMIN_CREDENTIALS.email);
      
      // Update existing user to be admin
      existingAdmin.isAdmin = true;
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin status');
    } else {
      // Hash password
      console.log('🔐 Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, salt);

      // Create admin user
      const adminUser = new User({
        ...ADMIN_CREDENTIALS,
        password: hashedPassword
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', ADMIN_CREDENTIALS.email);
      console.log('🔑 Password:', ADMIN_CREDENTIALS.password);
      console.log('⚠️  IMPORTANT: Change the password after first login!');
    }

    // Verify admin was created/updated
    const admin = await User.findOne({ email: ADMIN_CREDENTIALS.email });
    console.log('\n📊 Admin User Details:');
    console.log('  Name:', admin.name);
    console.log('  Email:', admin.email);
    console.log('  Is Admin:', admin.isAdmin);
    console.log('  Is Verified:', admin.isVerified);
    console.log('  Created At:', admin.createdAt);

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedAdmin();
