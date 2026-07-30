import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaUserTie } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-red-gradient p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                <FaHeartbeat className="text-white fs-5" />
              </div>
              <span className="brand-title text-white fs-4">Life<span className="text-red">Link</span></span>
            </div>
            <p className="text-secondary small leading-relaxed">
              LifeLink National Emergency Blood Network. Empowering real-time blood discovery across India with 24x7 automated emergency dispatch.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small fw-semibold">
              <FaShieldAlt /> 100% HIPAA & Security Compliant
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><Link to="/find-blood" className="text-decoration-none text-secondary">Find Blood Stock</Link></li>
              <li><Link to="/emergency-request" className="text-decoration-none text-secondary">Emergency Request</Link></li>
              <li><Link to="/become-donor" className="text-decoration-none text-secondary">Donor Portal</Link></li>
              <li><Link to="/blood-banks" className="text-decoration-none text-secondary">Blood Banks Directory</Link></li>
              <li><Link to="/admin/login" className="text-decoration-none text-warning fw-bold">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase text-white fw-bold mb-3">National Helplines</h6>
            <div className="p-3 rounded-3 bg-secondary bg-opacity-20 border border-secondary border-opacity-25 mb-2">
              <div className="d-flex align-items-center gap-2 text-danger fw-bold fs-5">
                <FaPhoneAlt /> 9866594904
              </div>
              <small className="text-secondary d-block mt-1">24x7 Direct Emergency Dispatch</small>
            </div>
            <p className="small text-secondary mb-0">Toll-Free Health Line: 1800-BLOOD-HELP</p>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase text-white fw-bold mb-3">National Headquarters</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2 text-white fw-semibold">
                <FaUserTie className="text-warning" /> Kalapaneni Ritesh Chowdary
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-danger" /> Kukatpally, Hyderabad, Telangana
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-info" /> medasaniritesh2007@gmail.com
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-success" /> 9866594904
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small">
          <p className="mb-0">© 2026 LifeLink Healthcare Platform. Managed by Kalapaneni Ritesh Chowdary.</p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <Link to="/admin/login" className="text-warning text-decoration-none fw-bold">Super Admin Login</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
