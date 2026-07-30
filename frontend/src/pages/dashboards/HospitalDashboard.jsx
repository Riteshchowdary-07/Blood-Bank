import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaHospital, FaBed, FaPlus, FaCheckCircle, FaHeartbeat } from 'react-icons/fa';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [icuBeds, setIcuBeds] = useState(45);

  return (
    <div className="container py-4">
      <div className="glass-card p-4 rounded-4 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-primary mb-1">HOSPITAL TRAUMA PORTAL</span>
            <h3 className="fw-bold text-dark mb-0">{user?.name || 'AIIMS Emergency & Trauma Center'}</h3>
            <p className="text-muted small mb-0">Reg No: HOSP-DEL-001 | Category: Trauma Center & Specialty</p>
          </div>
          <a href="/find-blood" className="btn btn-primary rounded-pill px-4 fw-bold">
            SEARCH REGIONAL BLOOD NETWORK
          </a>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card p-4 rounded-4">
            <h5 className="fw-bold text-dark mb-3"><FaBed className="text-primary me-2" /> Emergency ICU Bed Capacity</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="number"
                className="form-control form-control-lg fw-bold text-primary w-50"
                value={icuBeds}
                onChange={(e) => setIcuBeds(e.target.value)}
              />
              <span className="fw-bold text-dark">Available Trauma Beds</span>
            </div>
            <small className="text-success d-block mt-2"><FaCheckCircle /> Synced with Regional Emergency Dispatch</small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card p-4 rounded-4">
            <h5 className="fw-bold text-dark mb-3"><FaHeartbeat className="text-danger me-2" /> Active Reserved Blood Batches</h5>
            <div className="p-3 bg-light rounded-3 border">
              <strong className="text-danger">REQ-2026-07901 (2 Units O-)</strong>
              <div className="small text-muted">Assigned Facility: Apex Rotary Central Bank</div>
              <span className="badge bg-success mt-2">DISPATCH IN TRANSIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
