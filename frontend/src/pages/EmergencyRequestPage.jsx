import React, { useState } from 'react';
import { api } from '../services/api';
import ReceiptModal from '../components/ReceiptModal';
import { FaHeartbeat, FaPhoneAlt, FaHospital, FaMapMarkerAlt, FaLocationArrow, FaPaperPlane } from 'react-icons/fa';

export default function EmergencyRequestPage() {
  const [formData, setFormData] = useState({
    patientName: '',
    contactPhone: '',
    bloodGroup: 'O-',
    unitsRequired: 2,
    hospitalName: 'AIIMS Emergency Trauma Center',
    district: 'Central Delhi'
  });
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/emergency/request', {
        ...formData,
        lat: 28.6139,
        lng: 77.2090
      });
      setLoading(false);
      if (res.data.success) {
        setReceiptData(res.data.request);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-4 p-md-5 border-danger border-2 rounded-4 shadow-lg">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-2">
              <FaHeartbeat className="fs-1 pulse-emergency" />
            </div>
            <h2 className="fw-extrabold text-dark mb-1">Create Emergency Blood Request</h2>
            <p className="text-muted small">Broadcast urgent request to nearby blood banks and active donors immediately.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control rounded-3 py-2"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">Emergency Contact Number *</label>
                <div className="input-group">
                  <span className="input-group-text"><FaPhoneAlt className="text-danger" /></span>
                  <input
                    type="tel"
                    required
                    className="form-control rounded-end-3 py-2"
                    placeholder="+91 98765 43210"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">Required Blood Group *</label>
                <select
                  className="form-select rounded-3 py-2 fw-bold text-danger"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">Units Required *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="form-control rounded-3 py-2 fw-bold"
                  value={formData.unitsRequired}
                  onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">Hospital / Medical Center *</label>
                <div className="input-group">
                  <span className="input-group-text"><FaHospital className="text-primary" /></span>
                  <input
                    type="text"
                    required
                    className="form-control rounded-end-3 py-2"
                    placeholder="e.g. AIIMS Trauma Center"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="fw-bold small text-dark mb-1">District / Region *</label>
                <div className="input-group">
                  <span className="input-group-text"><FaMapMarkerAlt className="text-danger" /></span>
                  <input
                    type="text"
                    required
                    className="form-control rounded-end-3 py-2"
                    placeholder="e.g. Central Delhi"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-emergency btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-5" disabled={loading}>
              <FaPaperPlane /> {loading ? 'BROADCASTING REQUEST...' : 'BROADCAST EMERGENCY REQUEST NOW'}
            </button>
          </form>
        </div>
      </div>

      {receiptData && (
        <ReceiptModal requestData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
}
