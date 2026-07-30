import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, socket } from '../../services/api';
import ReceiptModal from '../../components/ReceiptModal';
import InteractiveMap from '../../components/InteractiveMap';
import { FaHeartbeat, FaQrcode, FaCheckCircle, FaClock, FaPlusCircle, FaPhoneAlt } from 'react-icons/fa';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchRequests();
    api.get('/donors').then(res => setDonors(res.data.data || []));

    // Listen to real-time status updates via Socket.IO
    socket.on('emergency_request_updated', (updated) => {
      setRequests(prev => prev.map(r => r._id === updated._id ? updated : r));
    });

    return () => {
      socket.off('emergency_request_updated');
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/emergency/requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      {/* Patient Header */}
      <div className="glass-card p-4 rounded-4 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-danger mb-1">PATIENT PORTAL</span>
            <h3 className="fw-bold text-dark mb-0">Welcome, {user?.name || 'Rahul Sharma'}</h3>
            <p className="text-muted small mb-0">Track active blood requests, download digital QR receipts, and discover nearby donors.</p>
          </div>
          <a href="/emergency-request" className="btn btn-emergency pulse-emergency d-flex align-items-center gap-2">
            <FaPlusCircle /> NEW EMERGENCY REQUEST
          </a>
        </div>
      </div>

      <div className="row g-4">
        {/* Request History & Real-Time Status */}
        <div className="col-lg-7">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Active Emergency Requests ({requests.length})</h5>
            {requests.length === 0 ? (
              <div className="alert alert-info">No active emergency requests found.</div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="p-3 bg-light rounded-3 mb-3 border border-danger border-opacity-25">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-danger fs-6 me-2">{req.bloodGroup}</span>
                      <strong className="text-dark">{req.unitsRequired} Units Needed</strong>
                      <div className="small text-muted">{req.hospitalName} ({req.district})</div>
                    </div>
                    <span className="badge bg-success px-3 py-2 text-uppercase">{req.status}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top small">
                    <span className="text-muted"><FaClock className="me-1" /> Ref: {req.requestNumber}</span>
                    <button onClick={() => setSelectedReceipt(req)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill fw-semibold">
                      <FaQrcode /> View Digital QR Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Nearby Donors Map */}
        <div className="col-lg-5">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Nearby Emergency Donors Map</h5>
            <InteractiveMap donors={donors} />
          </div>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal requestData={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
