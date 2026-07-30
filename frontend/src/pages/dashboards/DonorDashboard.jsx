import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, socket } from '../../services/api';
import { FaHandHoldingHeart, FaAward, FaCalendarCheck, FaBell, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [alerts, setAlerts] = useState([
    {
      _id: 'alt_1',
      requestNumber: 'REQ-2026-07901',
      patientName: 'Emergency Patient (Rahul S.)',
      bloodGroup: 'O-',
      unitsRequired: 2,
      hospitalName: 'AIIMS Trauma Center',
      distanceKm: '1.2'
    }
  ]);

  useEffect(() => {
    // Listen for real-time emergency requests via Socket.IO
    socket.on('emergency_request_created', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    return () => {
      socket.off('emergency_request_created');
    };
  }, []);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await api.put('/donors/availability', { isAvailable: nextState });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = (alertId) => {
    setAlerts(prev => prev.filter(a => a._id !== alertId));
    alert('Thank you! Your donation response has been confirmed and transmitted to the hospital dispatch.');
  };

  return (
    <div className="container py-4">
      {/* Donor Profile Summary Header */}
      <div className="glass-card p-4 rounded-4 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-red-gradient text-white p-3 rounded-circle fs-3 fw-bold">
              O-
            </div>
            <div>
              <span className="badge bg-success mb-1">REGISTERED VOLUNTEER DONOR</span>
              <h3 className="fw-bold text-dark mb-0">{user?.name || 'Dr. Anita Roy'}</h3>
              <p className="text-muted small mb-0">Hero Badge: <strong className="text-warning">🏆 Gold LifeSaver</strong> (850 Points)</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="form-check form-switch fs-5">
              <input
                className="form-check-input text-danger cursor-pointer"
                type="checkbox"
                checked={isAvailable}
                onChange={handleToggleAvailability}
                id="availSwitch"
              />
              <label className="form-check-label fw-bold small ms-2" htmlFor="availSwitch">
                {isAvailable ? <span className="text-success">Available for Emergency</span> : <span className="text-muted">Unavailable</span>}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Metric Cards */}
        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 text-center">
            <FaHandHoldingHeart className="fs-1 text-danger mb-2" />
            <h2 className="fw-extrabold text-dark mb-0">8</h2>
            <p className="text-muted small mb-0">Total Lifetime Donations</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 text-center">
            <FaAward className="fs-1 text-warning mb-2" />
            <h2 className="fw-extrabold text-dark mb-0">850</h2>
            <p className="text-muted small mb-0">Reward Lifesaver Points</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 rounded-4 text-center">
            <FaCalendarCheck className="fs-1 text-success mb-2" />
            <h5 className="fw-bold text-success mb-0 mt-2">ELIGIBLE NOW</h5>
            <p className="text-muted small mb-0">Next Eligible: Today (Ready)</p>
          </div>
        </div>

        {/* Incoming Emergency Alert Requests */}
        <div className="col-12">
          <div className="glass-card p-4 rounded-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <FaBell className="text-danger pulse-emergency" /> Live Incoming Emergency Requests ({alerts.length})
              </h5>
            </div>

            {alerts.length === 0 ? (
              <div className="alert alert-light border">No active emergency alerts in your vicinity at this moment.</div>
            ) : (
              alerts.map((alt) => (
                <div key={alt._id} className="p-3 bg-light rounded-3 mb-3 border border-danger border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <span className="badge bg-danger fs-6 me-2">Urgent: {alt.bloodGroup}</span>
                    <strong className="text-dark">{alt.patientName}</strong>
                    <div className="small text-muted">{alt.hospitalName} (~{alt.distanceKm || '1.5'} km away)</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button onClick={() => setAlerts(prev => prev.filter(a => a._id !== alt._id))} className="btn btn-outline-secondary btn-sm px-3 rounded-pill">
                      Decline
                    </button>
                    <button onClick={() => handleAcceptRequest(alt._id)} className="btn btn-danger btn-sm px-4 rounded-pill fw-bold">
                      <FaCheckCircle className="me-1" /> ACCEPT DONATION CALL
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
