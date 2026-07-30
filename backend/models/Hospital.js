const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  registrationNo: { type: String, required: true },
  category: { type: String, enum: ['Government', 'Private', 'Specialty', 'Trauma Center'], default: 'Trauma Center' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  emergencyIcuBeds: { type: Number, default: 20 },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
