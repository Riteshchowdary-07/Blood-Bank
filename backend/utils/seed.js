const bcrypt = require('bcryptjs');

const initialUsers = [
  {
    _id: 'usr_admin_ritesh',
    name: 'Kalapaneni Ritesh Chowdary (Super Admin)',
    email: 'medasaniritesh2007@gmail.com',
    role: 'admin',
    phone: '9866594904',
    city: 'Hyderabad',
    district: 'Kukatpally',
    state: 'Telangana',
    isVerified: true,
    isApproved: true
  },
  {
    _id: '60c72b2f9b1d8b2404e9a001',
    name: 'Rahul Sharma (Patient)',
    email: 'patient@lifelink.com',
    role: 'patient',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    district: 'Central Delhi',
    isVerified: true
  },
  {
    _id: '60c72b2f9b1d8b2404e9a002',
    name: 'Dr. Anita Roy (Donor)',
    email: 'donor@lifelink.com',
    role: 'donor',
    phone: '+91 98111 22334',
    city: 'New Delhi',
    district: 'Central Delhi',
    isVerified: true
  }
];

function generateInventory(baseCount = 14) {
  return [
    { bloodGroup: 'A+', unitsAvailable: baseCount + 10, collectionDate: '2026-07-20', expiryDate: '2026-08-30', status: 'Available' },
    { bloodGroup: 'A-', unitsAvailable: Math.max(3, baseCount - 4), collectionDate: '2026-07-22', expiryDate: '2026-09-01', status: 'Available' },
    { bloodGroup: 'B+', unitsAvailable: baseCount + 15, collectionDate: '2026-07-18', expiryDate: '2026-08-28', status: 'Available' },
    { bloodGroup: 'B-', unitsAvailable: Math.max(3, baseCount - 3), collectionDate: '2026-07-25', expiryDate: '2026-09-05', status: 'Available' },
    { bloodGroup: 'AB+', unitsAvailable: baseCount + 4, collectionDate: '2026-07-15', expiryDate: '2026-08-25', status: 'Available' },
    { bloodGroup: 'AB-', unitsAvailable: Math.max(2, baseCount - 6), collectionDate: '2026-07-24', expiryDate: '2026-09-04', status: 'Available' },
    { bloodGroup: 'O+', unitsAvailable: baseCount + 20, collectionDate: '2026-07-21', expiryDate: '2026-08-31', status: 'Available' },
    { bloodGroup: 'O-', unitsAvailable: Math.max(4, baseCount - 2), collectionDate: '2026-07-26', expiryDate: '2026-09-06', status: 'Available' }
  ];
}

// 28 STATE CAPITALS & MAJOR CITIES BLOOD BANKS
const initialBloodBanks = [
  // TELANGANA (HQ)
  { _id: 'bb_hq_01', name: 'LifeLink National HQ Blood Bank', licenseNumber: 'BB-TEL-HQ99', phone: '9866594904', email: 'medasaniritesh2007@gmail.com', city: 'Hyderabad', district: 'Kukatpally', state: 'Telangana', isOpen24x7: true, rating: 5.0, location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally Main Road, Hyderabad, Telangana' }, inventory: generateInventory(30) },
  { _id: 'bb_hyd_01', name: 'NTR Memorial Trust Blood Bank', licenseNumber: 'BB-TEL-1001', phone: '+91 40 3079 9999', email: 'bloodbank@ntrmemorialtrust.org', city: 'Hyderabad', district: 'Banjara Hills', state: 'Telangana', isOpen24x7: true, rating: 4.9, location: { lat: 17.4156, lng: 78.4347, address: 'Road No 2, Banjara Hills, Hyderabad' }, inventory: generateInventory(20) },

  // ANDHRA PRADESH (Amaravati / Vijayawada)
  { _id: 'bb_ap_01', name: 'Government General Hospital Blood Bank Amaravati', licenseNumber: 'BB-AP-6001', phone: '+91 866 242 2222', email: 'ggh.amaravati@ap.gov.in', city: 'Amaravati', district: 'Guntur', state: 'Andhra Pradesh', isOpen24x7: true, rating: 4.85, location: { lat: 16.5131, lng: 80.5165, address: 'Capital Region, Amaravati, Andhra Pradesh' }, inventory: generateInventory(18) },

  // ARUNACHAL PRADESH (Itanagar)
  { _id: 'bb_aru_01', name: 'TRIHMS State Blood Centre Itanagar', licenseNumber: 'BB-ARU-01', phone: '+91 360 235 0331', email: 'trihms.itanagar@arunachal.gov.in', city: 'Itanagar', district: 'Papum Pare', state: 'Arunachal Pradesh', isOpen24x7: true, rating: 4.8, location: { lat: 27.0844, lng: 93.6053, address: 'Naharlagun, Itanagar, Arunachal Pradesh' }, inventory: generateInventory(14) },

  // ASSAM (Dispur / Guwahati)
  { _id: 'bb_as_01', name: 'Gauhati Medical College Central Blood Bank', licenseNumber: 'BB-ASS-01', phone: '+91 361 252 9457', email: 'gmch.bloodbank@assam.gov.in', city: 'Dispur', district: 'Guwahati', state: 'Assam', isOpen24x7: true, rating: 4.88, location: { lat: 26.1433, lng: 91.7898, address: 'Bhangagarh, Dispur, Guwahati, Assam' }, inventory: generateInventory(22) },

  // BIHAR (Patna)
  { _id: 'bb_bih_01', name: 'PMCH Central Blood Bank Patna', licenseNumber: 'BB-BIH-9001', phone: '+91 612 230 0080', email: 'pmch.patna@bihar.gov.in', city: 'Patna', district: 'Ashok Rajpath', state: 'Bihar', isOpen24x7: true, rating: 4.82, location: { lat: 25.6200, lng: 85.1600, address: 'Ashok Rajpath, Patna, Bihar' }, inventory: generateInventory(24) },

  // CHHATTISGARH (Raipur)
  { _id: 'bb_cg_01', name: 'Dr. BRAM Hospital Central Blood Bank Raipur', licenseNumber: 'BB-CG-01', phone: '+91 771 223 4400', email: 'mekahara.raipur@cg.gov.in', city: 'Raipur', district: 'Jail Road', state: 'Chhattisgarh', isOpen24x7: true, rating: 4.84, location: { lat: 21.2514, lng: 81.6296, address: 'Jail Road, Raipur, Chhattisgarh' }, inventory: generateInventory(16) },

  // GOA (Panaji)
  { _id: 'bb_goa_01', name: 'Goa Medical College Central Blood Bank Panaji', licenseNumber: 'BB-GOA-01', phone: '+91 832 245 8700', email: 'gmc.bloodbank@goa.gov.in', city: 'Panaji', district: 'Bambolim', state: 'Goa', isOpen24x7: true, rating: 4.9, location: { lat: 15.4619, lng: 73.8567, address: 'Bambolim, Panaji, Goa' }, inventory: generateInventory(15) },

  // GUJARAT (Gandhinagar / Ahmedabad)
  { _id: 'bb_guj_01', name: 'Civil Hospital Red Cross Blood Center Gandhinagar', licenseNumber: 'BB-GUJ-01', phone: '+91 79 2322 1011', email: 'bloodbank.gandhinagar@gujarat.gov.in', city: 'Gandhinagar', district: 'Sector 12', state: 'Gujarat', isOpen24x7: true, rating: 4.89, location: { lat: 23.2156, lng: 72.6369, address: 'Sector 12, Gandhinagar, Gujarat' }, inventory: generateInventory(20) },

  // HARYANA & PUNJAB (Chandigarh)
  { _id: 'bb_chd_01', name: 'PGIMER Regional Transfusion Centre Chandigarh', licenseNumber: 'BB-UT-01', phone: '+91 172 275 6480', email: 'pgimer.bloodbank@pgimer.edu.in', city: 'Chandigarh', district: 'Sector 12', state: 'Chandigarh', isOpen24x7: true, rating: 4.96, location: { lat: 30.7626, lng: 76.7766, address: 'Sector 12, Chandigarh' }, inventory: generateInventory(28) },

  // HIMACHAL PRADESH (Shimla)
  { _id: 'bb_hp_01', name: 'IGMC Central Blood Transfusion Centre Shimla', licenseNumber: 'BB-HP-01', phone: '+91 177 280 4251', email: 'igmc.shimla@hp.gov.in', city: 'Shimla', district: 'Lakkar Bazar', state: 'Himachal Pradesh', isOpen24x7: true, rating: 4.87, location: { lat: 31.1048, lng: 77.1734, address: 'Ridge Road, Lakkar Bazar, Shimla' }, inventory: generateInventory(14) },

  // JHARKHAND (Ranchi)
  { _id: 'bb_jhk_01', name: 'RIMS Regional Blood Center Ranchi', licenseNumber: 'BB-JHK-01', phone: '+91 651 254 1533', email: 'rims.ranchi@jharkhand.gov.in', city: 'Ranchi', district: 'Bariatu', state: 'Jharkhand', isOpen24x7: true, rating: 4.81, location: { lat: 23.3856, lng: 85.3589, address: 'Bariatu Road, Ranchi, Jharkhand' }, inventory: generateInventory(19) },

  // KARNATAKA (Bengaluru)
  { _id: 'bb_blr_01', name: 'Rotary Bangalore TTK Blood Bank', licenseNumber: 'BB-KAR-2001', phone: '+91 80 2528 2384', email: 'ttkbloodbank@rotaryttk.org', city: 'Bengaluru', district: 'Indiranagar', state: 'Karnataka', isOpen24x7: true, rating: 4.9, location: { lat: 12.9784, lng: 77.6408, address: 'Indiranagar, Bengaluru, Karnataka' }, inventory: generateInventory(22) },

  // KERALA (Thiruvananthapuram)
  { _id: 'bb_ker_01', name: 'Sree Chitra Tirunal Blood Centre Thiruvananthapuram', licenseNumber: 'BB-KER-01', phone: '+91 471 252 4444', email: 'sctimst.blood@kerala.gov.in', city: 'Thiruvananthapuram', district: 'Medical College', state: 'Kerala', isOpen24x7: true, rating: 4.93, location: { lat: 8.5241, lng: 76.9366, address: 'Medical College Campus, Thiruvananthapuram' }, inventory: generateInventory(21) },

  // MADHYA PRADESH (Bhopal)
  { _id: 'bb_mp_01', name: 'AIIMS Central Blood Centre Bhopal', licenseNumber: 'BB-MP-01', phone: '+91 755 267 2355', email: 'aiims.bhopal@mp.gov.in', city: 'Bhopal', district: 'Saket Nagar', state: 'Madhya Pradesh', isOpen24x7: true, rating: 4.91, location: { lat: 23.2032, lng: 77.4567, address: 'Saket Nagar, Bhopal, Madhya Pradesh' }, inventory: generateInventory(23) },

  // MAHARASHTRA (Mumbai)
  { _id: 'bb_mum_01', name: 'Tata Memorial Hospital Blood Bank Mumbai', licenseNumber: 'BB-MAH-3001', phone: '+91 22 2417 7000', email: 'bloodbank@tmc.gov.in', city: 'Mumbai', district: 'Parel', state: 'Maharashtra', isOpen24x7: true, rating: 4.95, location: { lat: 19.0028, lng: 72.8428, address: 'Dr. E Borges Road, Parel, Mumbai' }, inventory: generateInventory(25) },

  // MANIPUR (Imphal)
  { _id: 'bb_mn_01', name: 'RIMS Regional Transfusion Centre Imphal', licenseNumber: 'BB-MAN-01', phone: '+91 385 241 4629', email: 'rims.imphal@manipur.gov.in', city: 'Imphal', district: 'Lamphelpat', state: 'Manipur', isOpen24x7: true, rating: 4.82, location: { lat: 24.8170, lng: 93.9180, address: 'Lamphelpat, Imphal, Manipur' }, inventory: generateInventory(12) },

  // MEGHALAYA (Shillong)
  { _id: 'bb_meg_01', name: 'NEIGRIHMS Blood Bank Shillong', licenseNumber: 'BB-MEG-01', phone: '+91 364 253 8020', email: 'neigrihms.shillong@meghalaya.gov.in', city: 'Shillong', district: 'Mawdiangdiang', state: 'Meghalaya', isOpen24x7: true, rating: 4.86, location: { lat: 25.5900, lng: 91.9400, address: 'Mawdiangdiang, Shillong, Meghalaya' }, inventory: generateInventory(14) },

  // MIZORAM (Aizawl)
  { _id: 'bb_miz_01', name: 'Civil Hospital Central Blood Bank Aizawl', licenseNumber: 'BB-MIZ-01', phone: '+91 389 232 2318', email: 'civilhosp.aizawl@mizoram.gov.in', city: 'Aizawl', district: 'Dawrpui', state: 'Mizoram', isOpen24x7: true, rating: 4.8, location: { lat: 23.7271, lng: 92.7176, address: 'Dawrpui, Aizawl, Mizoram' }, inventory: generateInventory(11) },

  // NAGALAND (Kohima)
  { _id: 'bb_nag_01', name: 'Naga Hospital Authority Blood Bank Kohima', licenseNumber: 'BB-NAG-01', phone: '+91 370 229 0432', email: 'nhak.kohima@nagaland.gov.in', city: 'Kohima', district: 'Naga Bazaar', state: 'Nagaland', isOpen24x7: true, rating: 4.81, location: { lat: 25.6751, lng: 94.1086, address: 'Naga Bazaar, Kohima, Nagaland' }, inventory: generateInventory(12) },

  // ODISHA (Bhubaneswar)
  { _id: 'bb_odi_01', name: 'Capital Hospital Central Blood Bank Bhubaneswar', licenseNumber: 'BB-ODI-01', phone: '+91 674 239 1983', email: 'capitalhosp.bbsr@odisha.gov.in', city: 'Bhubaneswar', district: 'Unit 6', state: 'Odisha', isOpen24x7: true, rating: 4.88, location: { lat: 20.2644, lng: 85.8281, address: 'Unit 6, Bhubaneswar, Odisha' }, inventory: generateInventory(20) },

  // RAJASTHAN (Jaipur)
  { _id: 'bb_raj_01', name: 'SMS Medical College Central Blood Bank Jaipur', licenseNumber: 'BB-RAJ-7001', phone: '+91 141 256 0291', email: 'sms.jaipur@rajasthan.gov.in', city: 'Jaipur', district: 'JLN Marg', state: 'Rajasthan', isOpen24x7: true, rating: 4.9, location: { lat: 26.8978, lng: 75.8156, address: 'Jawahar Lal Nehru Marg, Jaipur' }, inventory: generateInventory(24) },

  // SIKKIM (Gangtok)
  { _id: 'bb_sik_01', name: 'STNM State Transfusion Centre Gangtok', licenseNumber: 'BB-SIK-01', phone: '+91 3592 202 016', email: 'stnm.gangtok@sikkim.gov.in', city: 'Gangtok', district: 'Sochakgang', state: 'Sikkim', isOpen24x7: true, rating: 4.85, location: { lat: 27.3389, lng: 88.6065, address: 'Sochakgang, Gangtok, Sikkim' }, inventory: generateInventory(13) },

  // TAMIL NADU (Chennai)
  { _id: 'bb_che_01', name: 'Rotary Central TTK Blood Bank Chennai', licenseNumber: 'BB-TN-4001', phone: '+91 44 2811 5000', email: 'bloodbank@rotaryttkchennai.org', city: 'Chennai', district: 'Royapettah', state: 'Tamil Nadu', isOpen24x7: true, rating: 4.92, location: { lat: 13.0522, lng: 80.2633, address: 'Royapettah, Chennai, Tamil Nadu' }, inventory: generateInventory(26) },

  // TRIPURA (Agartala)
  { _id: 'bb_tri_01', name: 'AGMC & GBP Hospital Blood Bank Agartala', licenseNumber: 'BB-TRI-01', phone: '+91 381 235 0055', email: 'agmc.agartala@tripura.gov.in', city: 'Agartala', district: 'Kunjaban', state: 'Tripura', isOpen24x7: true, rating: 4.83, location: { lat: 23.8567, lng: 91.2867, address: 'Kunjaban, Agartala, Tripura' }, inventory: generateInventory(14) },

  // UTTAR PRADESH (Lucknow)
  { _id: 'bb_up_01', name: 'KGMU Transfusion Medicine Centre Lucknow', licenseNumber: 'BB-UP-8001', phone: '+91 522 225 7540', email: 'kgmu.lucknow@up.gov.in', city: 'Lucknow', district: 'Chowk', state: 'Uttar Pradesh', isOpen24x7: true, rating: 4.92, location: { lat: 26.8689, lng: 80.9167, address: 'Shah Mina Road, Chowk, Lucknow' }, inventory: generateInventory(27) },

  // UTTARAKHAND (Dehradun)
  { _id: 'bb_uk_01', name: 'Doon Medical College Central Blood Bank Dehradun', licenseNumber: 'BB-UK-01', phone: '+91 135 272 6020', email: 'doonhosp.dehradun@uk.gov.in', city: 'Dehradun', district: 'Patel Nagar', state: 'Uttarakhand', isOpen24x7: true, rating: 4.86, location: { lat: 30.3165, lng: 78.0322, address: 'Patel Nagar, Dehradun, Uttarakhand' }, inventory: generateInventory(17) },

  // WEST BENGAL (Kolkata)
  { _id: 'bb_wb_01', name: 'Central Blood Bank Kolkata', licenseNumber: 'BB-WB-5001', phone: '+91 33 2241 3700', email: 'centralbloodbank@wbhealth.gov.in', city: 'Kolkata', district: 'Maniktala', state: 'West Bengal', isOpen24x7: true, rating: 4.88, location: { lat: 22.5855, lng: 88.3789, address: 'Vivekananda Road, Maniktala, Kolkata' }, inventory: generateInventory(25) },

  // DELHI UT (New Delhi)
  { _id: 'bb_del_01', name: 'Apex Rotary Central Blood Bank', licenseNumber: 'BB-DEL-8891', phone: '+91 11 2345 6789', email: 'bloodbank@lifelink.com', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', isOpen24x7: true, rating: 4.9, location: { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' }, inventory: generateInventory(20) },

  // JAMMU & KASHMIR (Srinagar)
  { _id: 'bb_jk_01', name: 'SMHS Hospital Transfusion Centre Srinagar', licenseNumber: 'BB-JK-01', phone: '+91 194 245 2017', email: 'smhs.srinagar@jk.gov.in', city: 'Srinagar', district: 'Karan Nagar', state: 'Jammu and Kashmir', isOpen24x7: true, rating: 4.85, location: { lat: 34.0837, lng: 74.8000, address: 'Karan Nagar, Srinagar, Jammu & Kashmir' }, inventory: generateInventory(16) }
];

const initialHospitals = [
  { _id: 'hosp_hq_01', name: 'LifeLink National Emergency Trauma HQ', registrationNo: 'HOSP-TEL-HQ01', category: 'Trauma Center', phone: '9866594904', email: 'medasaniritesh2007@gmail.com', city: 'Hyderabad', district: 'Kukatpally', state: 'Telangana', location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally Main Road, Hyderabad, Telangana' }, emergencyIcuBeds: 50 },
  { _id: 'hosp_01', name: 'AIIMS Emergency & Trauma Center', registrationNo: 'HOSP-DEL-001', category: 'Trauma Center', phone: '+91 11 2658 8500', email: 'hospital@lifelink.com', city: 'New Delhi', district: 'South Delhi', state: 'Delhi', location: { lat: 28.5672, lng: 77.2100, address: 'Ansari Nagar, New Delhi' }, emergencyIcuBeds: 45 }
];

const initialDonors = [
  {
    _id: '60c72b2f9b1d8b2404e9c001',
    name: 'Dr. Anita Roy',
    email: 'donor@lifelink.com',
    phone: '+91 98111 22334',
    bloodGroup: 'O-',
    isAvailable: true,
    emergencyAlertsEnabled: true,
    lastDonationDate: '2026-04-10',
    nextEligibleDate: '2026-07-10',
    totalDonations: 8,
    rating: 4.95,
    badge: 'Gold LifeSaver',
    points: 850,
    location: { lat: 28.6180, lng: 77.2120, address: 'Connaught Place, New Delhi' }
  },
  {
    _id: '60c72b2f9b1d8b2404e9c002',
    name: 'Siddharth Rao',
    email: 'siddharth.donor@lifelink.com',
    phone: '9866594904',
    bloodGroup: 'O+',
    isAvailable: true,
    emergencyAlertsEnabled: true,
    lastDonationDate: '2026-04-01',
    nextEligibleDate: '2026-07-01',
    totalDonations: 6,
    rating: 4.9,
    badge: 'Silver Champion',
    points: 620,
    location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally, Hyderabad' }
  }
];

const initialRequests = [
  {
    _id: '60c72b2f9b1d8b2404e9e001',
    requestNumber: 'REQ-2026-07901',
    patientName: 'Rahul Sharma',
    contactPhone: '9866594904',
    bloodGroup: 'O-',
    unitsRequired: 2,
    urgencyLevel: 'Emergency',
    hospitalName: 'LifeLink National Emergency Trauma HQ',
    district: 'Kukatpally',
    location: { lat: 17.4947, lng: 78.3996, address: 'Kukatpally, Hyderabad' },
    status: 'Reserved',
    assignedBloodBankName: 'LifeLink National HQ Blood Bank',
    aiMatchScore: 98,
    qrReceiptCode: 'LL-QR-889102',
    createdAt: new Date()
  }
];

module.exports = {
  initialUsers,
  initialBloodBanks,
  initialDonors,
  initialHospitals,
  initialRequests
};
