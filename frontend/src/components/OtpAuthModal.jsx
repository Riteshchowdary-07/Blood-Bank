import React, { useState } from 'react';
import { FaShieldAlt, FaPhoneAlt, FaCheckCircle, FaHeartbeat } from 'react-icons/fa';

export default function OtpAuthModal({ targetItem, onVerified, onClose }) {
  const [phone, setPhone] = useState('9866594904');
  const [patientName, setPatientName] = useState('Emergency Patient');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('4904');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpStep(true);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified({ patientName, phone });
    }, 400);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="bg-red-gradient p-4 text-white">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaHeartbeat className="fs-3 text-white pulse-emergency" />
              <h5 className="modal-title fw-bold text-white mb-0">Emergency Authentication & OTP</h5>
            </div>
            <p className="small mb-0 opacity-90">Verify your mobile contact number to instantly confirm blood reservation.</p>
          </div>

          <div className="modal-body p-4">
            <div className="alert alert-light border mb-3">
              <small className="text-muted d-block">Facility Selected:</small>
              <strong className="text-danger fs-6">{targetItem?.name}</strong>
              <small className="text-muted d-block mt-1">Location: {targetItem?.location?.address || 'Kukatpally, Hyderabad'}</small>
            </div>

            {!otpStep ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-3">
                  <label className="fw-bold small text-dark mb-1">Patient / Caregiver Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control py-2"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-1">Emergency Mobile Number (for SMS & OTP) *</label>
                  <div className="input-group">
                    <span className="input-group-text">+91</span>
                    <input
                      type="tel"
                      required
                      className="form-control form-control-lg fw-bold"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-emergency btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                  <FaPhoneAlt /> SEND SECURITY OTP & RESERVE
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <div className="p-3 bg-light rounded-3 mb-4 text-center border border-success">
                  <span className="badge bg-success mb-2">SMS OTP SENT</span>
                  <small className="text-muted d-block mb-1">Code sent to <strong>+91 {phone}</strong></small>
                  <label className="fw-bold text-dark d-block mb-2">Enter 4-Digit Security OTP</label>
                  <input
                    type="text"
                    maxLength="4"
                    required
                    className="form-control form-control-lg text-center fs-3 font-monospace tracking-widest fw-extrabold text-success"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-success btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                  <FaCheckCircle /> {loading ? 'VERIFYING...' : 'VERIFY OTP & DISPATCH BLOOD NOW'}
                </button>
              </form>
            )}
          </div>

          <div className="modal-footer bg-light p-3 border-top-0 justify-content-between">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Cancel
            </button>
            <span className="small text-muted"><FaShieldAlt className="text-success" /> Instant Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
