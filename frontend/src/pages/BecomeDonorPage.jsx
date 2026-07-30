import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHandHoldingHeart, FaUserPlus, FaAward, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

export default function BecomeDonorPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    city: 'New Delhi',
    district: 'Central Delhi',
    bloodGroup: 'O+',
    role: 'donor'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      if (res.success) {
        navigate('/dashboard/donor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-center">
        <div className="col-lg-6">
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-3">VOLUNTEER DONOR NETWORK</span>
          <h1 className="display-5 fw-extrabold text-dark mb-3">Become a LifeLink Emergency Hero</h1>
          <p className="lead text-secondary mb-4">
            Your blood donation can save up to 3 lives in critical trauma care. As a registered LifeLink donor, you control your availability and receive emergency notifications when compatible patients nearby need urgent help.
          </p>

          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold text-dark mb-3">Eligibility Guidelines</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-0">
              <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Age between 18 and 65 years old</li>
              <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Minimum body weight of 50 kg</li>
              <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Last blood donation was at least 90 days ago</li>
              <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Healthy hemoglobin level (&gt; 12.5 g/dL)</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg">
            <h3 className="fw-bold text-dark mb-3">Register as a Donor</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control py-2"
                  placeholder="e.g. Dr. Anita Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control py-2"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control py-2"
                    placeholder="+91 98000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">Blood Group</label>
                  <select
                    className="form-select py-2 fw-bold text-danger"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="fw-bold small text-dark mb-1">District</label>
                  <input
                    type="text"
                    required
                    className="form-control py-2"
                    placeholder="Central Delhi"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-emergency btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                <FaUserPlus /> COMPLETE DONOR REGISTRATION
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
