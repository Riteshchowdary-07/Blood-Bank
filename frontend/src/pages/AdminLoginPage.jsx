import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaLock, FaEnvelope, FaShieldAlt, FaPhoneAlt } from 'react-icons/fa';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('medasaniritesh2007@gmail.com');
  const [phone, setPhone] = useState('9866594904');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = (email || '').trim().toLowerCase();
    const targetPhone = (phone || '').trim();

    if (targetEmail !== 'medasaniritesh2007@gmail.com' && targetPhone !== '9866594904') {
      setError('Access Denied. Super Admin access restricted to Kalapaneni Ritesh Chowdary (medasaniritesh2007@gmail.com / 9866594904).');
      return;
    }

    try {
      const res = await loginUser('medasaniritesh2007@gmail.com', '9866594904');
      if (res.success) {
        navigate('/dashboard/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed.');
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-md mx-auto py-4">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg border-dark border-2">
          <div className="text-center mb-4">
            <div className="bg-dark text-warning p-3 rounded-circle d-inline-flex mb-2">
              <FaUserShield className="fs-2" />
            </div>
            <span className="badge bg-danger text-uppercase d-block max-w-xs mx-auto mb-2 fw-bold">SUPER ADMIN EXCLUSIVE PORTAL</span>
            <h3 className="fw-bold text-dark mb-1">Super Admin Authentication</h3>
            <p className="text-muted small">Official Administrator: <strong>Kalapaneni Ritesh Chowdary</strong></p>
          </div>

          {error && <div className="alert alert-danger py-2 small fw-bold">{error}</div>}

          <form onSubmit={handleAdminLogin}>
            <div className="mb-3">
              <label className="fw-bold small text-dark mb-1">Official Admin Email</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white"><FaEnvelope /></span>
                <input
                  type="email"
                  required
                  className="form-control py-2 fw-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-bold small text-dark mb-1">Official Mobile Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white"><FaPhoneAlt /></span>
                <input
                  type="tel"
                  required
                  className="form-control py-2 fw-bold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark btn-lg w-100 py-3 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2">
              <FaShieldAlt className="text-warning" /> AUTHENTICATE SUPER ADMIN PORTAL
            </button>
          </form>

          <div className="text-center text-muted small mt-3">
            🔒 Protected by LifeLink National Security Protocols
          </div>
        </div>
      </div>
    </div>
  );
}
