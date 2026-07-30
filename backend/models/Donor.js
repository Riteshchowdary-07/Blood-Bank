const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true 
  },
  isAvailable: { type: Boolean, default: true },
  emergencyAlertsEnabled: { type: Boolean, default: true },
  lastDonationDate: { type: Date },
  nextEligibleDate: { type: Date },
  totalDonations: { type: Number, default: 0 },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
    address: { type: String, default: 'Central Delhi, New Delhi' }
  },
  rating: { type: Number, default: 4.9 },
  badge: { type: String, default: 'Silver LifeSaver' },
  points: { type: Number, default: 250 }
});

module.exports = mongoose.model('Donor', donorSchema);
