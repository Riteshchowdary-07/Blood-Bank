const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['patient', 'donor', 'blood_bank', 'hospital', 'government', 'admin'],
    required: true 
  },
  phone: { type: String },
  city: { type: String, default: 'New Delhi' },
  district: { type: String, default: 'Central Delhi' },
  state: { type: String, default: 'Delhi' },
  isVerified: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true }, // For blood banks / hospitals / donors
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
