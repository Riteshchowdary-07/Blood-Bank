import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeartbeat, FaCheckCircle, FaSave } from 'react-icons/fa';

export default function ProfileModal({ onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Kalapaneni Ritesh Chowdary',
    email: user?.email || 'medasaniritesh2007@gmail.com',
    phone: user?.phone || '9866594904',
    city: user?.city || 'Hyderabad',
    district: user?.district || 'Kukatpally',
    bloodGroup: user?.bloodGroup || 'O+'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="bg-dark text-white p-4">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaUser className="fs-3 text-warning" />
              <h5 className="modal-title fw-bold text-white mb-0">Personal Information & Profile</h5>
            </div>
            <p className="small mb-0 opacity-90">View and edit your personal emergency profile details.</p>
          </div>

          <div className="modal-body p-4">
            {saved && (
              <div className="alert alert-success py-2 fw-bold d-flex align-items-center gap-2 mb-3">
                <FaCheckCircle /> Personal Profile Updated Successfully!
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser className="text-secondary" /></span>
                  <input
                    type="text"
                    required
                    className="form-control fw-bold py-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaPhoneAlt className="text-success" /></span>
                    <input
                      type="tel"
                      required
                      className="form-control fw-bold py-2"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaEnvelope className="text-info" /></span>
                    <input
                      type="email"
                      required
                      className="form-control py-2"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Blood Group</label>
                  <select
                    className="form-select fw-bold text-danger py-2"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">District / City</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaMapMarkerAlt className="text-danger" /></span>
                    <input
                      type="text"
                      required
                      className="form-control py-2"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-dark btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                <FaSave className="text-warning" /> SAVE PERSONAL PROFILE
              </button>
            </form>
          </div>

          <div className="modal-footer bg-light p-3 border-top-0">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
