import React from 'react';
import { FaHospital, FaPhoneAlt, FaBed, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

export default function HospitalsDirectoryPage() {
  const hospitals = [
    {
      id: 1,
      name: 'AIIMS Emergency & Trauma Center',
      category: 'Trauma Center & Specialty',
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
      phone: '+91 11 2658 8500',
      icuBeds: 45,
      bloodStock: 'Connected to Network'
    },
    {
      id: 2,
      name: 'Safdarjung Hospital Emergency Wing',
      category: 'Government Multi-Specialty',
      address: 'Ring Road, Opposite AIIMS, New Delhi',
      phone: '+91 11 2616 5060',
      icuBeds: 60,
      bloodStock: 'Connected to Network'
    },
    {
      id: 3,
      name: 'Max Healthcare Emergency Regional Wing',
      category: 'Private Specialty Hospital',
      address: 'Saket Institutional Area, South Delhi',
      phone: '+91 11 2651 5050',
      icuBeds: 30,
      bloodStock: 'Connected to Network'
    }
  ];

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Partner Hospital Network</h2>
        <p className="text-muted small">Trauma centers and hospitals linked with LifeLink for direct emergency blood reservations.</p>
      </div>

      <div className="row g-4">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="col-md-6 col-lg-4">
            <div className="glass-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge bg-primary mb-2 text-uppercase">{hosp.category}</span>
                <h4 className="fw-bold text-dark mb-2">{hosp.name}</h4>
                <p className="small text-muted mb-3"><FaMapMarkerAlt className="text-danger me-1" />{hosp.address}</p>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaBed className="text-primary fs-5" />
                    <span className="fw-bold text-dark">ICU Emergency Beds: {hosp.icuBeds}</span>
                  </div>
                  <small className="text-success fw-semibold"><FaCheckCircle /> Direct LifeLink Integration</small>
                </div>
              </div>

              <a href={`tel:${hosp.phone}`} className="btn btn-outline-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2">
                <FaPhoneAlt /> CALL HOSPITAL DESK
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
