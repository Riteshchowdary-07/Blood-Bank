import React from 'react';
import { FaShieldAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

export default function AiMatchCard({ item, type = 'bank', onReserve }) {
  const isBank = type === 'bank';

  return (
    <div className="glass-card p-3 mb-3 border-start border-4 border-danger position-relative">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span className={`badge ${isBank ? 'bg-danger' : 'bg-success'} text-uppercase me-2`}>
            {isBank ? 'Blood Bank' : 'Emergency Donor'}
          </span>
          <span className="badge bg-primary text-uppercase">
            Score: {item.matchScore || 95}% MATCH
          </span>
          <h5 className="fw-bold text-dark mb-0 mt-1">{item.name}</h5>
        </div>

        <div className="text-end">
          <div className="text-danger fw-extrabold fs-5 mb-0">
            {item.distanceKm} <small className="fs-6">KM</small>
          </div>
          <small className="text-muted d-block"><FaClock className="me-1 text-primary" /> ~{item.estimatedTimeMin || item.estimatedArrivalMin} mins away</small>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <p className="small text-secondary mb-0">
          <FaMapMarkerAlt className="text-danger me-1" /> {item.location?.address || 'India'}
        </p>

        {item.location?.lat && item.location?.lng && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary py-0 px-2 rounded-pill small fw-bold d-inline-flex align-items-center gap-1"
          >
            Google Maps <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
          </a>
        )}
      </div>

      {isBank ? (
        <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-3 small">
          <div>
            <span className="text-muted d-block">Matching Stock Available:</span>
            <strong className="text-danger fs-6">{item.totalMatchingUnits} Units</strong>
          </div>
          <div className="text-end">
            <span className="text-muted d-block">Operating Status:</span>
            <strong className="text-success">{item.isOpen24x7 ? '24x7 Open' : 'Open Now'}</strong>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-3 small">
          <div>
            <span className="text-muted d-block">Blood Group:</span>
            <strong className="text-danger fs-6">{item.bloodGroup}</strong>
          </div>
          <div className="text-end">
            <span className="text-muted d-block">Hero Badge:</span>
            <strong className="text-warning">🏆 {item.badge || 'Gold Saver'}</strong>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between">
        <small className="text-success fw-semibold d-flex align-items-center gap-1">
          <FaCheckCircle /> {item.recommendationReason || 'Highest compatible matching rating'}
        </small>

        {onReserve && (
          <button onClick={() => onReserve(item)} className="btn btn-sm btn-danger px-4 py-2 rounded-pill fw-bold">
            RESERVE NOW
          </button>
        )}
      </div>
    </div>
  );
}
