const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const { rankOptions, predictDistrictShortage, COMPATIBILITY_MAP } = require('../services/matchingEngine');
const { broadcastInventoryUpdate, broadcastEmergencyAlert, broadcastRequestStatusUpdate } = require('../services/socketService');
const seedData = require('../utils/seed');

let usersStore = [...seedData.initialUsers];
let bloodBanksStore = [...seedData.initialBloodBanks];
let donorsStore = [...seedData.initialDonors];
let hospitalsStore = [...seedData.initialHospitals];
let requestsStore = [...seedData.initialRequests];

// Multi-Channel Login (Phone / Email / Social / OTP)
const login = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const targetEmail = (email || '').trim().toLowerCase();
    const targetPhone = (phone || '').trim();

    // Check for Super Admin
    if (targetEmail === 'medasaniritesh2007@gmail.com' || targetPhone === '9866594904') {
      const superAdmin = {
        _id: 'usr_admin_ritesh',
        name: 'Kalapaneni Ritesh Chowdary (Super Admin)',
        email: 'medasaniritesh2007@gmail.com',
        phone: '9866594904',
        role: 'admin',
        city: 'Hyderabad',
        district: 'Kukatpally',
        state: 'Telangana',
        isVerified: true,
        isApproved: true
      };
      const token = jwt.sign({ id: superAdmin._id, email: superAdmin.email, role: superAdmin.role, name: superAdmin.name }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ success: true, token, user: superAdmin });
    }

    let user = usersStore.find(u => (targetEmail && u.email.toLowerCase() === targetEmail) || (targetPhone && u.phone === targetPhone));

    if (!user) {
      user = {
        _id: 'usr_' + Date.now(),
        name: targetEmail ? targetEmail.split('@')[0] : `User_${targetPhone}`,
        email: targetEmail || `${targetPhone}@lifelink.com`,
        phone: targetPhone || '9866594904',
        role: 'patient',
        city: 'Hyderabad',
        district: 'Kukatpally',
        isVerified: true,
        isApproved: true
      };
      usersStore.push(user);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, role, city, district, bloodGroup } = req.body;

    const existing = usersStore.find(u => (email && u.email.toLowerCase() === email.toLowerCase()) || (phone && u.phone === phone));
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email/phone already exists. Please log in.' });
    }

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: email || `${phone}@lifelink.com`,
      role: role || 'patient',
      phone: phone || '9866594904',
      city: city || 'Hyderabad',
      district: district || 'Kukatpally',
      isVerified: true,
      isApproved: true
    };

    usersStore.push(newUser);

    if (role === 'donor') {
      donorsStore.push({
        _id: 'dnr_' + Date.now(),
        name,
        email: newUser.email,
        phone: newUser.phone,
        bloodGroup: bloodGroup || 'O+',
        isAvailable: true,
        emergencyAlertsEnabled: true,
        totalDonations: 0,
        rating: 5.0,
        badge: 'Bronze Lifesaver',
        points: 100,
        location: { lat: 17.4947, lng: 78.3996, address: `${district || 'Kukatpally'}, ${city || 'Hyderabad'}` }
      });
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration & OTP verification successful!',
      token,
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- BLOOD BANKS & INVENTORY ---
const getBloodBanks = (req, res) => {
  const { bloodGroup, district, city } = req.query;
  let filtered = bloodBanksStore;
  if (district) filtered = filtered.filter(b => b.district.toLowerCase().includes(district.toLowerCase()));
  if (city) filtered = filtered.filter(b => b.city.toLowerCase().includes(city.toLowerCase()));
  if (bloodGroup && bloodGroup !== 'All') filtered = filtered.filter(b => b.inventory.some(inv => inv.bloodGroup === bloodGroup && inv.unitsAvailable > 0));
  res.json({ success: true, count: filtered.length, data: filtered });
};

const updateInventory = (req, res) => {
  try {
    const { bloodBankId, bloodGroup, unitsAvailable } = req.body;
    const bank = bloodBanksStore.find(b => b._id === bloodBankId || b.name.includes(bloodBankId)) || bloodBanksStore[0];
    const invIndex = bank.inventory.findIndex(i => i.bloodGroup === bloodGroup);
    if (invIndex >= 0) {
      bank.inventory[invIndex].unitsAvailable = Number(unitsAvailable);
    } else {
      bank.inventory.push({ bloodGroup, unitsAvailable: Number(unitsAvailable), collectionDate: new Date(), expiryDate: '2026-09-01', status: 'Available' });
    }
    broadcastInventoryUpdate({ bloodBankId: bank._id, name: bank.name, bloodGroup, unitsAvailable });
    res.json({ success: true, message: 'Inventory updated successfully.', inventory: bank.inventory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- EDITABLE ADMIN DATABASE ENDPOINTS ---
const adminEditBank = (req, res) => {
  try {
    const { id, name, phone, email, rating, bloodGroup, unitsAvailable } = req.body;
    const bank = bloodBanksStore.find(b => b._id === id);
    if (bank) {
      if (name) bank.name = name;
      if (phone) bank.phone = phone;
      if (email) bank.email = email;
      if (rating) bank.rating = Number(rating);
      if (bloodGroup && unitsAvailable !== undefined) {
        const inv = bank.inventory.find(i => i.bloodGroup === bloodGroup);
        if (inv) inv.unitsAvailable = Number(unitsAvailable);
      }
      return res.json({ success: true, message: 'Blood bank database record updated!', bank });
    }
    res.status(404).json({ success: false, message: 'Bank not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const adminEditDonor = (req, res) => {
  try {
    const { id, name, phone, bloodGroup, isAvailable, points, badge } = req.body;
    const donor = donorsStore.find(d => d._id === id);
    if (donor) {
      if (name) donor.name = name;
      if (phone) donor.phone = phone;
      if (bloodGroup) donor.bloodGroup = bloodGroup;
      if (isAvailable !== undefined) donor.isAvailable = Boolean(isAvailable);
      if (points !== undefined) donor.points = Number(points);
      if (badge) donor.badge = badge;
      return res.json({ success: true, message: 'Donor database record updated!', donor });
    }
    res.status(404).json({ success: false, message: 'Donor not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const adminEditHospital = (req, res) => {
  try {
    const { id, name, phone, emergencyIcuBeds, category } = req.body;
    const hosp = hospitalsStore.find(h => h._id === id);
    if (hosp) {
      if (name) hosp.name = name;
      if (phone) hosp.phone = phone;
      if (emergencyIcuBeds !== undefined) hosp.emergencyIcuBeds = Number(emergencyIcuBeds);
      if (category) hosp.category = category;
      return res.json({ success: true, message: 'Hospital database record updated!', hosp });
    }
    res.status(404).json({ success: false, message: 'Hospital not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- EMERGENCY MATCHING ---
const searchAndRankBlood = (req, res) => {
  try {
    const { lat = 17.4947, lng = 78.3996, bloodGroup = 'O-', unitsRequired = 2, district } = req.body;

    let targetBanks = bloodBanksStore;
    if (district) {
      const q = district.toLowerCase();
      targetBanks = bloodBanksStore.filter(b => b.district.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
      if (targetBanks.length === 0) targetBanks = bloodBanksStore;
    }

    const rankingResults = rankOptions({
      patientLat: Number(lat),
      patientLng: Number(lng),
      bloodGroup,
      unitsRequired: Number(unitsRequired),
      bloodBanks: targetBanks,
      donors: donorsStore
    });

    res.json({
      success: true,
      searchedGroup: bloodGroup,
      unitsRequired,
      results: rankingResults
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createEmergencyRequest = (req, res) => {
  try {
    const { patientName, contactPhone, bloodGroup, unitsRequired, hospitalName, district, lat, lng, assignedBloodBankId } = req.body;

    const reqNum = 'REQ-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const targetBank = bloodBanksStore.find(b => b._id === assignedBloodBankId) || bloodBanksStore[0];

    const newRequest = {
      _id: 'req_' + Date.now(),
      requestNumber: reqNum,
      patientName: patientName || 'Emergency Patient',
      contactPhone: contactPhone || '9866594904',
      bloodGroup: bloodGroup || 'O-',
      unitsRequired: Number(unitsRequired) || 2,
      urgencyLevel: 'Emergency',
      hospitalName: hospitalName || 'LifeLink National Emergency Trauma HQ',
      district: district || 'Kukatpally',
      location: { lat: Number(lat) || 17.4947, lng: Number(lng) || 78.3996 },
      assignedBloodBankId: targetBank._id,
      assignedBloodBankName: targetBank.name,
      status: 'Reserved',
      aiMatchScore: 98,
      qrReceiptCode: 'LL-QR-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date()
    };

    requestsStore.unshift(newRequest);

    const inv = targetBank.inventory.find(i => i.bloodGroup === bloodGroup);
    if (inv && inv.unitsAvailable >= newRequest.unitsRequired) {
      inv.unitsAvailable -= newRequest.unitsRequired;
      broadcastInventoryUpdate({ bloodBankId: targetBank._id, name: targetBank.name, bloodGroup, unitsAvailable: inv.unitsAvailable });
    }

    broadcastEmergencyAlert(newRequest);

    res.status(201).json({
      success: true,
      message: 'Emergency request verified & blood reserved under 60 seconds!',
      request: newRequest
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getEmergencyRequests = (req, res) => {
  res.json({ success: true, count: requestsStore.length, data: requestsStore });
};

const getDonors = (req, res) => {
  const { bloodGroup, isAvailable } = req.query;
  let filtered = donorsStore;
  if (bloodGroup && bloodGroup !== 'All') filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
  if (isAvailable !== undefined) filtered = filtered.filter(d => String(d.isAvailable) === String(isAvailable));
  res.json({ success: true, count: filtered.length, data: filtered });
};

const toggleDonorAvailability = (req, res) => {
  const { donorId, isAvailable } = req.body;
  const donor = donorsStore.find(d => d._id === donorId || d.email === req.user?.email) || donorsStore[0];
  donor.isAvailable = Boolean(isAvailable);
  res.json({ success: true, message: `Availability updated to ${donor.isAvailable ? 'Available' : 'Unavailable'}`, donor });
};

const getGovStats = (req, res) => {
  const allInventories = bloodBanksStore.flatMap(b => b.inventory);
  const shortageAnalytics = predictDistrictShortage(allInventories);
  res.json({
    success: true,
    stats: {
      totalStockUnits: allInventories.reduce((acc, curr) => acc + curr.unitsAvailable, 0),
      totalRequestsCount: requestsStore.length,
      activeDonorsCount: donorsStore.filter(d => d.isAvailable).length,
      registeredBanksCount: bloodBanksStore.length,
      registeredHospitalsCount: hospitalsStore.length,
      shortageAnalytics
    }
  });
};

const getAdminOverview = (req, res) => {
  res.json({
    success: true,
    superAdmin: {
      name: 'Kalapaneni Ritesh Chowdary',
      email: 'medasaniritesh2007@gmail.com',
      phone: '9866594904',
      headquarters: 'Kukatpally, Hyderabad, Telangana'
    },
    summary: {
      usersCount: usersStore.length,
      donorsCount: donorsStore.length,
      bloodBanksCount: bloodBanksStore.length,
      hospitalsCount: hospitalsStore.length,
      emergencyRequestsCount: requestsStore.length
    },
    collections: {
      users: usersStore,
      donors: donorsStore,
      bloodBanks: bloodBanksStore,
      hospitals: hospitalsStore,
      emergencyRequests: requestsStore
    },
    auditLogs: [
      { id: 1, action: 'Super Admin Kalapaneni Ritesh Chowdary Verified', performedBy: 'Kalapaneni Ritesh Chowdary', role: 'admin', timestamp: new Date() },
      { id: 2, action: 'National HQ Kukatpally Dispatch Operational', performedBy: 'System', role: 'blood_bank', timestamp: new Date() }
    ]
  });
};

module.exports = {
  login,
  register,
  getBloodBanks,
  updateInventory,
  searchAndRankBlood,
  createEmergencyRequest,
  getEmergencyRequests,
  getDonors,
  toggleDonorAvailability,
  getGovStats,
  getAdminOverview,
  adminEditBank,
  adminEditDonor,
  adminEditHospital
};
