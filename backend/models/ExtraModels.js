const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
  bloodGroup: { type: String, required: true },
  units: { type: Number, default: 1 },
  donationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Scheduled', 'Cancelled'], default: 'Completed' },
  certificateUrl: { type: String }
});

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['emergency', 'inventory', 'request_update', 'system'], default: 'emergency' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  district: { type: String, required: true },
  totalRequests: { type: Number, default: 0 },
  fulfilledRequests: { type: Number, default: 0 },
  shortageGroups: [{ type: String }],
  generatedAt: { type: Date, default: Date.now }
});

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  role: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const rewardSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  badgeName: { type: String, required: true },
  pointsEarned: { type: Number, required: true },
  awardedAt: { type: Date, default: Date.now }
});

module.exports = {
  Donation: mongoose.model('Donation', donationSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Report: mongoose.model('Report', reportSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema),
  Reward: mongoose.model('Reward', rewardSchema)
};
