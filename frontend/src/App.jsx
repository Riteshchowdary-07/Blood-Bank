import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import FindBloodPage from './pages/FindBloodPage';
import EmergencyRequestPage from './pages/EmergencyRequestPage';
import BecomeDonorPage from './pages/BecomeDonorPage';
import BloodBanksDirectoryPage from './pages/BloodBanksDirectoryPage';
import HospitalsDirectoryPage from './pages/HospitalsDirectoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LogoutPage from './pages/LogoutPage';

// Dashboards
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import BloodBankDashboard from './pages/dashboards/BloodBankDashboard';
import HospitalDashboard from './pages/dashboards/HospitalDashboard';
import GovDashboard from './pages/dashboards/GovDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Login & Logout Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />

              {/* Protected User Routes (Require Login / OTP Verification) */}
              <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/find-blood" element={<ProtectedRoute><FindBloodPage /></ProtectedRoute>} />
              <Route path="/emergency-request" element={<ProtectedRoute><EmergencyRequestPage /></ProtectedRoute>} />
              <Route path="/become-donor" element={<ProtectedRoute><BecomeDonorPage /></ProtectedRoute>} />
              <Route path="/blood-banks" element={<ProtectedRoute><BloodBanksDirectoryPage /></ProtectedRoute>} />
              <Route path="/hospitals" element={<ProtectedRoute><HospitalsDirectoryPage /></ProtectedRoute>} />

              {/* Dashboards */}
              <Route path="/dashboard/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/donor" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/blood-bank" element={<ProtectedRoute><BloodBankDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/hospital" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/government" element={<ProtectedRoute><GovDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
