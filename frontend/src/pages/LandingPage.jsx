import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import EmergencySearchWidget from '../components/EmergencySearchWidget';
import InteractiveMap from '../components/InteractiveMap';
import AiMatchCard from '../components/AiMatchCard';
import ReceiptModal from '../components/ReceiptModal';
import OtpAuthModal from '../components/OtpAuthModal';
import { 
  FaHeartbeat, FaSearch, FaUserPlus, FaHospital, FaClinicMedical, FaCheckCircle, 
  FaShieldAlt, FaClock, FaHandsHelping, FaAward, FaQuestionCircle, FaPhoneAlt, FaChevronRight 
} from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();
  const [matchResults, setMatchResults] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [pendingReservationBank, setPendingReservationBank] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    api.get('/blood-banks').then(res => setBloodBanks(res.data.data || []));
    api.get('/donors').then(res => setDonors(res.data.data || []));
  }, []);

  const handleWidgetSearch = async (searchParams) => {
    try {
      const res = await api.post('/emergency/match', searchParams);
      if (res.data.success) {
        setMatchResults(res.data);
        document.getElementById('search-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitiateReserve = (bank) => {
    setPendingReservationBank(bank);
  };

  const handleOtpVerifiedAndReserved = async ({ patientName, phone }) => {
    try {
      const bank = pendingReservationBank;
      const reqPayload = {
        patientName: patientName || 'Emergency Patient',
        contactPhone: phone || '9866594904',
        bloodGroup: matchResults?.searchedGroup || 'O-',
        unitsRequired: matchResults?.unitsRequired || 2,
        hospitalName: 'LifeLink National Emergency Trauma HQ',
        district: 'Kukatpally',
        lat: bank?.location?.lat || 17.4947,
        lng: bank?.location?.lng || 78.3996,
        assignedBloodBankId: bank?._id
      };

      const res = await api.post('/emergency/request', reqPayload);
      setPendingReservationBank(null);
      if (res.data.success) {
        setReceiptData(res.data.request);
      }
    } catch (err) {
      setPendingReservationBank(null);
      console.error(err);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="position-relative py-5 bg-white overflow-hidden border-bottom">
        <div className="container position-relative z-2">
          <div className="row align-items-center g-5 py-4">
            <div className="col-lg-6">
              <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-2">
                <FaHeartbeat className="pulse-emergency" /> NATIONAL EMERGENCY BLOOD NETWORK DISPATCH
              </span>
              <h1 className="display-4 fw-extrabold text-dark tracking-tight leading-tight mb-3">
                Save Lives in Minutes. <br />
                <span className="text-red">Locate & Reserve Blood Instantly.</span>
              </h1>
              <p className="lead text-secondary mb-4 leading-relaxed">
                National Headquarters: <strong>Kukatpally, Hyderabad</strong>. Managed by <strong>Kalapaneni Ritesh Chowdary</strong> (Helpline: <strong>9866594904</strong>). Connecting 100+ Pan-India facilities with direct Google Maps turn-by-turn navigation.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/emergency-request" className="btn btn-emergency btn-lg px-4 py-3 d-flex align-items-center gap-2 fs-5">
                  <FaHeartbeat /> IMMEDIATE EMERGENCY REQUEST
                </Link>
                <Link to="/become-donor" className="btn btn-outline-secondary btn-lg px-4 py-3 rounded-pill fw-semibold">
                  BECOME A DONOR
                </Link>
              </div>

              <div className="row g-3 pt-3 border-top">
                <div className="col-4">
                  <h3 className="fw-extrabold text-dark mb-0">15,800+</h3>
                  <small className="text-muted fw-semibold">Lives Saved</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-extrabold text-red mb-0">&lt; 1 Min</h3>
                  <small className="text-muted fw-semibold">Sub-Minute Dispatch</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-extrabold text-blue mb-0">100+</h3>
                  <small className="text-muted fw-semibold">Pan-India Banks</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <EmergencySearchWidget onSearch={handleWidgetSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS & INTERACTIVE MAP SECTION */}
      {matchResults && (
        <section id="search-results-section" className="py-5 bg-light border-bottom">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-5">
              <span className="badge bg-primary px-3 py-2 rounded-pill text-uppercase fw-bold">Smart Response Engine Results</span>
              <h2 className="display-6 fw-bold text-dark mt-2">Recommended Blood Banks & Donors</h2>
              <p className="text-muted">
                Ranked by distance, compatibility, live stock status, and estimated arrival time.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <h5 className="fw-bold text-dark mb-3">Top Compatible Blood Banks ({matchResults.results.rankedBloodBanks.length})</h5>
                {matchResults.results.rankedBloodBanks.map((bank) => (
                  <AiMatchCard key={bank._id} item={bank} type="bank" onReserve={handleInitiateReserve} />
                ))}
              </div>

              <div className="col-lg-6">
                <h5 className="fw-bold text-dark mb-3">Live Geographic Map</h5>
                <InteractiveMap bloodBanks={matchResults.results.rankedBloodBanks} donors={matchResults.results.rankedDonors} onReserveClick={handleInitiateReserve} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OTP AUTHENTICATION MODAL */}
      {pendingReservationBank && (
        <OtpAuthModal
          targetItem={pendingReservationBank}
          onVerified={handleOtpVerifiedAndReserved}
          onClose={() => setPendingReservationBank(null)}
        />
      )}

      {/* RECEIPT MODAL */}
      {receiptData && (
        <ReceiptModal requestData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
}
