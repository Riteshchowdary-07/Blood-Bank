import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaHeartbeat } from 'react-icons/fa';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    role: 'patient',
    city: 'New Delhi',
    district: 'Central Delhi',
    bloodGroup: 'O+'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      if (res.success) {
        switch (res.user.role) {
          case 'donor': navigate('/dashboard/donor'); break;
          case 'blood_bank': navigate('/dashboard/blood-bank'); break;
          case 'hospital': navigate('/dashboard/hospital'); break;
          case 'government': navigate('/dashboard/government'); break;
          case 'admin': navigate('/dashboard/admin'); break;
          default: navigate('/dashboard/patient'); break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark mb-1">Create LifeLink Account</h3>
            <p className="text-muted small">Select your role in the smart emergency blood network.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold small text-dark mb-1">Register As (Role)</label>
              <select
                className="form-select py-2 fw-bold text-primary"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="patient">Patient / Caregiver</option>
                <option value="donor">Volunteer Donor</option>
                <option value="blood_bank">Blood Bank Manager</option>
                <option value="hospital">Hospital Trauma Center</option>
                <option value="government">Government Health Authority</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="fw-bold small text-dark mb-1">Full Name / Facility Name</label>
              <input
                type="text"
                required
                className="form-control py-2"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
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

            <div className="row g-2 mb-3">
              <div className="col-6">
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

              <div className="col-6">
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

            <button type="submit" className="btn btn-medical w-100 py-3 mb-3 fw-bold">
              REGISTER ACCOUNT
            </button>

            <div className="text-center small text-muted">
              Already have an account? <Link to="/login" className="text-danger fw-bold">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
