import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaLocationArrow, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EmergencySearchWidget({ onSearch }) {
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [units, setUnits] = useState(2);
  const [district, setDistrict] = useState('Central Delhi');
  const [isLocating, setIsLocating] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ bloodGroup: selectedGroup, unitsRequired: units, district, lat: 28.6139, lng: 77.2090 });
  };

  const handleAutoLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          onSearch({ bloodGroup: selectedGroup, unitsRequired: units, district: 'Current GPS Location', lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setIsLocating(false);
          onSearch({ bloodGroup: selectedGroup, unitsRequired: units, district, lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className="glass-card p-4 shadow-lg border border-danger border-opacity-25 rounded-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaHeartbeat className="text-red fs-3 pulse-emergency" />
        <div>
          <h4 className="fw-bold text-dark mb-0">Emergency Blood Search</h4>
          <p className="text-muted small mb-0">Smart Compatibility & Instant Network Match</p>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit}>
        {/* Blood Group Selectors */}
        <label className="fw-bold small text-secondary text-uppercase tracking-wider mb-2">Select Needed Blood Group</label>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              className={`blood-badge btn ${selectedGroup === bg ? 'active' : ''}`}
              onClick={() => setSelectedGroup(bg)}
            >
              {bg}
            </button>
          ))}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="fw-bold small text-secondary mb-1">Required Blood Units</label>
            <input
              type="number"
              min="1"
              max="10"
              className="form-control form-control-lg rounded-3 border-secondary border-opacity-25 fw-bold"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="fw-bold small text-secondary mb-1">District / Region</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-secondary border-opacity-25"><FaMapMarkerAlt className="text-danger" /></span>
              <input
                type="text"
                className="form-control form-control-lg rounded-end-3 border-secondary border-opacity-25"
                placeholder="e.g. Central Delhi"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3">
          <button type="submit" className="btn btn-emergency btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 fs-5">
            <FaSearch /> FIND MATCHING BLOOD NOW
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill fw-semibold"
            onClick={handleAutoLocate}
            disabled={isLocating}
          >
            <FaLocationArrow /> {isLocating ? 'Locating...' : 'Use Live GPS'}
          </button>
        </div>
      </form>

      <div className="mt-3 pt-3 border-top border-secondary border-opacity-10 d-flex align-items-center justify-content-between text-muted small">
        <span>⚡ Powered by Smart Blood Matching & Emergency Response Engine</span>
        <span className="text-success fw-semibold"><FaShieldAlt /> 24x7 Live Dispatch</span>
      </div>
    </div>
  );
}
