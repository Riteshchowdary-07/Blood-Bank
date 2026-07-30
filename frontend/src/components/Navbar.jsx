import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';
import OrdersModal from './OrdersModal';
import { 
  FaHeartbeat, FaSearchLocation, FaHandHoldingHeart, FaUserCircle, FaSignOutAlt, 
  FaUser, FaClipboardList, FaShieldAlt 
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const isSuperAdmin = user?.email?.toLowerCase() === 'medasaniritesh2007@gmail.com' || user?.phone === '9866594904';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-2 shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="bg-red-gradient p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
              <FaHeartbeat className="text-white fs-4" />
            </div>
            <div>
              <span className="brand-title text-dark fs-4 tracking-tight">Life<span className="text-red">Link</span></span>
              <small className="d-block text-muted" style={{ fontSize: '0.7rem', marginTop: '-4px' }}>NATIONAL BLOOD NETWORK</small>
            </div>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center fw-medium">
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/find-blood">
                  <FaSearchLocation className="text-blue" /> Find Blood
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/become-donor">
                  <FaHandHoldingHeart className="text-red" /> Become Donor
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/blood-banks">Blood Banks Stores</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/hospitals">Hospitals</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <Link to="/emergency-request" className="btn btn-emergency pulse-emergency d-flex align-items-center gap-2 text-decoration-none me-2">
                <FaHeartbeat /> EMERGENCY REQUEST
              </Link>

              {user ? (
                <div className="d-flex align-items-center gap-2">
                  {/* Personal Info Quick Button */}
                  <button onClick={() => setShowProfileModal(true)} className="btn btn-outline-dark btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1">
                    <FaUser className="text-primary" /> Profile
                  </button>

                  {/* Orders History Quick Button */}
                  <button onClick={() => setShowOrdersModal(true)} className="btn btn-outline-dark btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1">
                    <FaClipboardList className="text-danger" /> Orders
                  </button>

                  {/* Admin Portal Quick Button (if Admin) */}
                  {isSuperAdmin && (
                    <Link to="/dashboard/admin" className="btn btn-dark btn-sm rounded-pill px-3 py-2 fw-bold text-warning d-flex align-items-center gap-1">
                      <FaShieldAlt className="text-warning" /> Admin
                    </Link>
                  )}

                  {/* Direct Prominent LOGOUT Button */}
                  <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1">
                    <FaSignOutAlt /> LOGOUT
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold">Login</Link>
                  <Link to="/register" className="btn btn-medical rounded-pill px-3 py-2 fw-semibold">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile & Orders Modals */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {showOrdersModal && <OrdersModal onClose={() => setShowOrdersModal(false)} />}
    </>
  );
}
