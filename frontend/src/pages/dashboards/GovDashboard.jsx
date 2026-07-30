import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FaBuilding, FaChartBar, FaExclamationTriangle, FaDownload, FaShieldAlt } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function GovDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/government/stats').then(res => setStats(res.data.stats));
  }, []);

  const barData = {
    labels: ['Central Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi'],
    datasets: [
      {
        label: 'Total Available Blood Units',
        data: [122, 98, 64, 45, 78],
        backgroundColor: '#D32F2F'
      },
      {
        label: 'Emergency Demand Requests',
        data: [42, 30, 28, 19, 25],
        backgroundColor: '#0288D1'
      }
    ]
  };

  const pieData = {
    labels: ['O+ (35%)', 'B+ (25%)', 'A+ (20%)', 'AB+ (10%)', 'Rare O-/A-/B-/AB- (10%)'],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: ['#D32F2F', '#0288D1', '#4CAF50', '#FF9800', '#9C27B0']
      }
    ]
  };

  return (
    <div className="container py-4">
      {/* Gov Header */}
      <div className="glass-card p-4 rounded-4 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-warning text-dark mb-1">GOVERNMENT HEALTH DIRECTORATE</span>
            <h3 className="fw-bold text-dark mb-0">Regional Health Authority Dashboard</h3>
            <p className="text-muted small mb-0">District Shortage Heatmaps & Public Health Surveillance</p>
          </div>
          <button className="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
            <FaDownload /> GENERATE REGULATORY REPORT
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="glass-card p-3 rounded-4 border-start border-4 border-danger">
            <small className="text-muted fw-bold">Total Regional Stock</small>
            <h2 className="fw-extrabold text-danger mb-0">{stats?.totalStockUnits || 122} Units</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-3 rounded-4 border-start border-4 border-primary">
            <small className="text-muted fw-bold">Active Registered Donors</small>
            <h2 className="fw-extrabold text-primary mb-0">{stats?.activeDonorsCount || 380} Donors</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-3 rounded-4 border-start border-4 border-success">
            <small className="text-muted fw-bold">Connected Blood Banks</small>
            <h2 className="fw-extrabold text-success mb-0">{stats?.registeredBanksCount || 3} Banks</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-3 rounded-4 border-start border-4 border-warning">
            <small className="text-muted fw-bold">Trauma Centers Linked</small>
            <h2 className="fw-extrabold text-warning mb-0">{stats?.registeredHospitalsCount || 2} Centers</h2>
          </div>
        </div>
      </div>

      {/* Chart.js Analytics */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold text-dark mb-3">District-Wise Stock vs Demand Surveillance</h5>
            <Bar data={barData} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 rounded-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Blood Group Stock Share</h5>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
