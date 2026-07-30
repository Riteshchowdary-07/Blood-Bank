import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutPage() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    setTimeout(() => {
      navigate('/login');
    }, 500);
  }, []);

  return (
    <div className="container py-5 text-center">
      <div className="max-w-md mx-auto py-5">
        <div className="glass-card p-5 rounded-4 shadow-lg">
          <FaSignOutAlt className="display-3 text-danger mb-3" />
          <h3 className="fw-bold text-dark mb-2">Logging Out...</h3>
          <p className="text-muted">Clearing session and redirecting to the login page.</p>
        </div>
      </div>
    </div>
  );
}
