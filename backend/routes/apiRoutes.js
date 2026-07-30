const express = require('express');
const router = express.Router();
const controllers = require('../controllers/apiControllers');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Auth routes
router.post('/auth/login', controllers.login);
router.post('/auth/register', controllers.register);

// Blood banks & Inventory routes
router.get('/blood-banks', controllers.getBloodBanks);
router.put('/inventory', controllers.updateInventory);

// Emergency & Smart Matching routes
router.post('/emergency/match', controllers.searchAndRankBlood);
router.post('/emergency/request', controllers.createEmergencyRequest);
router.get('/emergency/requests', controllers.getEmergencyRequests);

// Donors routes
router.get('/donors', controllers.getDonors);
router.put('/donors/availability', controllers.toggleDonorAvailability);

// Government & Analytics routes
router.get('/government/stats', controllers.getGovStats);

// Super Admin Exclusive & Editable Database routes
router.get('/admin/overview', controllers.getAdminOverview);
router.put('/admin/edit-bank', controllers.adminEditBank);
router.put('/admin/edit-donor', controllers.adminEditDonor);
router.put('/admin/edit-hospital', controllers.adminEditHospital);

module.exports = router;
