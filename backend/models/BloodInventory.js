const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  unitsAvailable: { type: Number, required: true, min: 0 },
  collectionDate: { type: Date, required: true, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'Reserved', 'Expired', 'Low Stock'], default: 'Available' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
