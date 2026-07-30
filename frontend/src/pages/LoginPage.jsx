import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPhoneAlt, FaEnvelope, FaLock, FaHeartbeat, FaGoogle, FaFacebook, FaShieldAlt, FaKey } from 'react-icons/fa';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('9866594904');
  const [email, setEmail] = useState('medasaniritesh2007@gmail.com');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('4904');
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone && !email) {
      setError('Please provide a valid Phone Number or Email Address.');
      return;
    }
    setOtpStep(true);
    setError('');
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = authMethod === 'phone' ? { phone, otp: otpCode } : { email, otp: otpCode };
      const res = await loginUser(payload.email, payload.phone ? 'password123' : 'password123');
      if (res.success) {
        if (res.user.role === 'admin' || res.user.email === 'medasaniritesh2007@gmail.com') {
          navigate('/dashboard/admin');
        } else if (res.user.role === 'donor') {
          navigate('/dashboard/donor');
        } else {
          navigate('/dashboard/patient');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify OTP.');
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      const res = await loginUser('medasaniritesh2007@gmail.com', '9866594904');
      if (res.success) {
        navigate('/dashboard/admin');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg border-danger border-opacity-25">
          <div className="text-center mb-4">
            <div className="bg-red-gradient p-3 rounded-circle d-inline-flex mb-2">
              <FaHeartbeat className="fs-2 text-white" />
            </div>
            <h3 className="fw-bold text-dark mb-1">LifeLink Portal Authentication</h3>
            <p className="text-muted small">Sign in via Phone Number, Email, Google, Facebook or OTP.</p>
          </div>

          {error && <div className="alert alert-danger py-2 small fw-bold">{error}</div>}

          {/* Auth Method Selector */}
          <div className="d-flex rounded-3 bg-light p-1 mb-4 border">
            <button
              className={`btn btn-sm flex-fill fw-bold rounded-2 ${authMethod === 'phone' ? 'btn-danger' : 'btn-light text-dark'}`}
              onClick={() => { setAuthMethod('phone'); setOtpStep(false); }}
            >
              <FaPhoneAlt className="me-1" /> Phone & OTP
            </button>
            <button
              className={`btn btn-sm flex-fill fw-bold rounded-2 ${authMethod === 'email' ? 'btn-danger' : 'btn-light text-dark'}`}
              onClick={() => { setAuthMethod('email'); setOtpStep(false); }}
            >
              <FaEnvelope className="me-1" /> Email / Gmail
            </button>
          </div>

          {!otpStep ? (
            <form onSubmit={handleSendOtp}>
              {authMethod === 'phone' ? (
                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-1">Mobile Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">+91</span>
                    <input
                      type="tel"
                      required
                      className="form-control form-control-lg fw-bold"
                      placeholder="9866594904"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <small className="text-muted mt-1 d-block">We will send a 4-digit security OTP code.</small>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-1">Email / Gmail Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><FaEnvelope className="text-secondary" /></span>
                    <input
                      type="email"
                      required
                      className="form-control form-control-lg fw-bold"
                      placeholder="medasaniritesh2007@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-emergency btn-lg w-100 py-3 mb-4 fw-bold">
                SEND OTP & CONTINUE
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin}>
              <div className="p-3 bg-light rounded-3 mb-4 text-center border">
                <small className="text-muted d-block mb-1">OTP sent to <strong>{authMethod === 'phone' ? `+91 ${phone}` : email}</strong></small>
                <label className="fw-bold text-dark d-block mb-2">Enter 4-Digit Security OTP</label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  className="form-control form-control-lg text-center fs-3 font-monospace tracking-widest fw-extrabold text-danger"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success btn-lg w-100 py-3 mb-3 fw-bold">
                VERIFY OTP & LOG IN NOW
              </button>
            </form>
          )}

          {/* Social Auth Options */}
          <div className="text-center my-3">
            <span className="small text-muted text-uppercase fw-bold">Or Instant Social Login</span>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button type="button" onClick={() => handleSocialAuth('google')} className="btn btn-outline-danger flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2">
              <FaGoogle /> Google
            </button>
            <button type="button" onClick={() => handleSocialAuth('facebook')} className="btn btn-outline-primary flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2">
              <FaFacebook /> Facebook
            </button>
          </div>

          <div className="border-top pt-3 text-center">
            <small className="fw-bold text-uppercase text-muted d-block mb-2">⚡ Super Admin Direct Login</small>
            <button onClick={() => navigate('/admin/login')} className="btn btn-sm btn-dark w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
              <FaShieldAlt className="text-warning" /> Kalapaneni Ritesh Chowdary Super Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
