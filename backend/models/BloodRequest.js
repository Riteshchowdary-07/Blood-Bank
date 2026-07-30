const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, required: true, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  unitsRequired: { type: Number, required: true },
  urgencyLevel: { type: String, enum: ['Emergency', 'Critical', 'Routine'], default: 'Emergency' },
  hospitalName: { type: String, required: true },
  district: { type: String, default: 'Central Delhi' },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
    address: { type: String }
  },
  assignedBloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
  assignedDonorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  status: { 
    type: String, 
    enum: ['Pending', 'Searching', 'Reserved', 'Fulfilled', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  },
  aiMatchScore: { type: Number, default: 95 },
  qrReceiptCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
