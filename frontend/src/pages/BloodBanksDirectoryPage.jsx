import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import InteractiveMap from '../components/InteractiveMap';
import { FaHospital, FaPhoneAlt, FaStar, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

export default function BloodBanksDirectoryPage() {
  const [bloodBanks, setBloodBanks] = useState([]);

  useEffect(() => {
    api.get('/blood-banks').then(res => setBloodBanks(res.data.data || []));
  }, []);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Blood Banks Directory</h2>
        <p className="text-muted small">Verified emergency blood bank centers operating in your region.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="row g-3">
            {bloodBanks.map((bank) => (
              <div key={bank._id} className="col-12">
                <div className="glass-card p-4 rounded-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-danger mb-1 text-uppercase">Verified Blood Bank</span>
                      <h4 className="fw-bold text-dark mb-1">{bank.name}</h4>
                      <p className="small text-muted mb-0"><FaMapMarkerAlt className="text-danger me-1" />{bank.location.address}</p>
                    </div>
                    <span className="badge bg-success px-3 py-2">⭐ {bank.rating || 4.8} Rating</span>
                  </div>

                  <hr className="my-3 opacity-10" />

                  <div className="mb-3">
                    <small className="fw-bold text-muted text-uppercase d-block mb-2">Live Inventory Stock</small>
                    <div className="d-flex flex-wrap gap-2">
                      {bank.inventory?.map((inv) => (
                        <span key={inv.bloodGroup} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-1">
                          <strong className="text-danger">{inv.bloodGroup}:</strong> {inv.unitsAvailable} Units
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-success fw-semibold"><FaCheckCircle /> 24x7 Emergency Ready Dispatch</span>
                    <a href={`tel:${bank.phone}`} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-1">
                      <FaPhoneAlt /> Call Facility
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-3">Geographic Map Distribution</h5>
            <InteractiveMap bloodBanks={bloodBanks} />
          </div>
        </div>
      </div>
    </div>
  );
}
