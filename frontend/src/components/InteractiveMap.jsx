import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaPhoneAlt, FaCheckCircle, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

// Custom Leaflet Icons using SVG Data URIs
const createCustomIcon = (color, symbol) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
    <path fill="${color}" stroke="#FFFFFF" stroke-width="2" d="M17 0C7.6 0 0 7.6 0 17c0 12.8 17 29 17 29s17-16.2 17-29c0-9.4-7.6-17-17-17z"/>
    <text x="17" y="22" fill="#FFFFFF" font-weight="bold" font-size="14" text-anchor="middle" font-family="sans-serif">${symbol}</text>
  </svg>`;
  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -42]
  });
};

const bankIcon = createCustomIcon('#D32F2F', '🏦');
const donorIcon = createCustomIcon('#2E7D32', '🩸');

export default function InteractiveMap({ bloodBanks = [], donors = [], center = [20.5937, 78.9629], zoom = 5, onReserveClick }) {
  return (
    <div className="map-container shadow-sm border border-light">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Blood Bank Markers */}
        {bloodBanks.map((bank, index) => (
          <Marker key={`bank-${bank._id || index}`} position={[bank.location.lat, bank.location.lng]} icon={bankIcon}>
            <Popup>
              <div className="p-1" style={{ maxWidth: '250px' }}>
                <span className="badge bg-danger mb-1 text-uppercase">Blood Bank</span>
                <h6 className="fw-bold text-dark mb-1">{bank.name}</h6>
                <p className="small text-muted mb-1">{bank.location.address}</p>
                <div className="d-flex justify-content-between align-items-center mb-2 small fw-semibold">
                  <span>Rating: ⭐ {bank.rating || 4.8}</span>
                  <span className="text-success">{bank.isOpen24x7 ? '24x7 Open' : 'Open'}</span>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${bank.location.lat},${bank.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary w-100 mb-2 fw-bold d-flex align-items-center justify-content-center gap-1"
                >
                  <FaMapMarkerAlt className="text-danger" /> Open in Google Maps <FaExternalLinkAlt style={{ fontSize: '0.7rem' }} />
                </a>

                <div className="d-flex gap-2">
                  <a href={`tel:${bank.phone}`} className="btn btn-sm btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-1">
                    <FaPhoneAlt /> Call
                  </a>
                  {onReserveClick && (
                    <button onClick={() => onReserveClick(bank)} className="btn btn-sm btn-danger w-50 fw-semibold">
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Privacy-Aware Donor Markers */}
        {donors.map((donor, index) => (
          <Marker key={`donor-${donor._id || index}`} position={[donor.location.lat, donor.location.lng]} icon={donorIcon}>
            <Popup>
              <div className="p-1" style={{ maxWidth: '220px' }}>
                <span className="badge bg-success mb-1 text-uppercase">Verified Donor</span>
                <h6 className="fw-bold text-dark mb-1">{donor.name}</h6>
                <p className="small text-muted mb-1">Group: <strong className="text-danger">{donor.bloodGroup}</strong></p>
                <div className="d-flex justify-content-between align-items-center small mb-2">
                  <span>Badge: 🏆 {donor.badge || 'Hero'}</span>
                  <span className="text-primary fw-semibold">{donor.distanceKm ? `${donor.distanceKm} km away` : 'Nearby'}</span>
                </div>
                <a href={`tel:${donor.phone}`} className="btn btn-sm btn-success w-100 fw-bold">
                  <FaPhoneAlt /> Call Volunteer Donor
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
