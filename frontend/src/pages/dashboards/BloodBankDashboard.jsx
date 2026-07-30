import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, socket } from '../../services/api';
import { FaHospital, FaBoxes, FaPlus, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

export default function BloodBankDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([
    { bloodGroup: 'A+', unitsAvailable: 18, expiryDate: '2026-08-30' },
    { bloodGroup: 'A-', unitsAvailable: 6, expiryDate: '2026-09-01' },
    { bloodGroup: 'B+', unitsAvailable: 24, expiryDate: '2026-08-28' },
    { bloodGroup: 'B-', unitsAvailable: 4, expiryDate: '2026-09-05' },
    { bloodGroup: 'AB+', unitsAvailable: 10, expiryDate: '2026-08-25' },
    { bloodGroup: 'AB-', unitsAvailable: 3, expiryDate: '2026-09-04' },
    { bloodGroup: 'O+', unitsAvailable: 32, expiryDate: '2026-08-31' },
    { bloodGroup: 'O-', unitsAvailable: 8, expiryDate: '2026-09-06' }
  ]);
  const [activeTab, setActiveTab] = useState('inventory');

  const handleUnitChange = async (group, newUnits) => {
    const updatedVal = Math.max(0, Number(newUnits));
    setInventory(prev => prev.map(item => item.bloodGroup === group ? { ...item, unitsAvailable: updatedVal } : item));

    try {
      await api.put('/inventory', {
        bloodBankId: '60c72b2f9b1d8b2404e9b001',
        bloodGroup: group,
        unitsAvailable: updatedVal
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      {/* Blood Bank Header */}
      <div className="glass-card p-4 rounded-4 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-danger mb-1">BLOOD BANK MANAGEMENT PORTAL</span>
            <h3 className="fw-bold text-dark mb-0">{user?.name || 'Apex Rotary Central Blood Bank'}</h3>
            <p className="text-muted small mb-0">License: BB-DEL-2024-8891 | Operating Status: 24x7 Emergency Ready</p>
          </div>
          <span className="badge bg-success fs-6 px-3 py-2">⭐ 4.9 Verified Facility</span>
        </div>
      </div>

      {/* Real-Time Inventory Grid */}
      <div className="glass-card p-4 rounded-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaBoxes className="text-danger" /> Live Blood Group Stock Inventory
          </h5>
          <span className="small text-muted">Updates sync in real-time across the LifeLink network</span>
        </div>

        <div className="row g-3">
          {inventory.map((item) => {
            const isLow = item.unitsAvailable < 5;
            return (
              <div key={item.bloodGroup} className="col-sm-6 col-md-3">
                <div className={`p-3 rounded-4 border ${isLow ? 'bg-danger bg-opacity-10 border-danger' : 'bg-light border-secondary border-opacity-25'}`}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="blood-badge active">{item.bloodGroup}</span>
                    {isLow && <span className="badge bg-danger small"><FaExclamationTriangle /> LOW STOCK</span>}
                  </div>

                  <div className="mb-2">
                    <label className="small text-muted fw-bold d-block">Available Units:</label>
                    <div className="input-group">
                      <input
                        type="number"
                        min="0"
                        className="form-control fw-extrabold text-danger fs-5"
                        value={item.unitsAvailable}
                        onChange={(e) => handleUnitChange(item.bloodGroup, e.target.value)}
                      />
                      <span className="input-group-text small">Units</span>
                    </div>
                  </div>

                  <small className="text-muted d-block text-truncate">Expiry: {item.expiryDate}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
