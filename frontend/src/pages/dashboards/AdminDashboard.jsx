import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  FaUserShield, FaUsers, FaHandHoldingHeart, FaHospital, FaClinicMedical, 
  FaHeartbeat, FaHistory, FaSearch, FaMapMarkerAlt, FaExternalLinkAlt, FaPhoneAlt, FaEnvelope, FaEdit, FaSave, FaCheckCircle 
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('banks');
  const [searchTerm, setSearchTerm] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setAdminData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Inline DB Editing Methods
  const handleUpdateBankStock = async (bankId, bloodGroup, units) => {
    try {
      const res = await api.put('/admin/edit-bank', { id: bankId, bloodGroup, unitsAvailable: units });
      setEditStatus(`Stock for ${bloodGroup} updated to ${units} units!`);
      fetchAdminOverview();
      setTimeout(() => setEditStatus(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDonorPoints = async (donorId, newPoints, newBadge) => {
    try {
      await api.put('/admin/edit-donor', { id: donorId, points: newPoints, badge: newBadge });
      setEditStatus('Donor points and badge updated!');
      fetchAdminOverview();
      setTimeout(() => setEditStatus(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHospitalBeds = async (hospitalId, beds) => {
    try {
      await api.put('/admin/edit-hospital', { id: hospitalId, emergencyIcuBeds: beds });
      setEditStatus('Hospital ICU Beds updated!');
      fetchAdminOverview();
      setTimeout(() => setEditStatus(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      {/* Super Admin Header */}
      <div className="glass-card p-4 rounded-4 mb-4 bg-dark text-white shadow-lg border border-secondary">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-warning text-dark p-3 rounded-circle fs-3 fw-bold">
              <FaUserShield />
            </div>
            <div>
              <span className="badge bg-danger mb-1 text-uppercase fw-bold">SUPER ADMIN EDITABLE DATABASE PORTAL</span>
              <h3 className="fw-bold text-white mb-0">Kalapaneni Ritesh Chowdary</h3>
              <p className="text-secondary small mb-0">
                <FaEnvelope className="text-info me-1" /> <strong className="text-warning">medasaniritesh2007@gmail.com</strong> | 
                <FaPhoneAlt className="text-success ms-2 me-1" /> <strong className="text-white">9866594904</strong> | 
                <FaMapMarkerAlt className="text-danger ms-2 me-1" /> National HQ: Kukatpally, Hyderabad
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="badge bg-success fs-6 px-3 py-2">LIVE DATABASE EDITING ACTIVE</span>
          </div>
        </div>
      </div>

      {editStatus && (
        <div className="alert alert-success py-2 fw-bold d-flex align-items-center gap-2 mb-3">
          <FaCheckCircle /> {editStatus}
        </div>
      )}

      {/* Summary Counters */}
      <div className="row g-3 mb-4">
        <div className="col-md-2 col-6">
          <div className="glass-card p-3 rounded-4 text-center border-start border-4 border-primary">
            <small className="text-muted fw-bold">Total Users</small>
            <h4 className="fw-extrabold text-primary mb-0">{adminData?.summary?.usersCount || 0}</h4>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="glass-card p-3 rounded-4 text-center border-start border-4 border-success">
            <small className="text-muted fw-bold">Volunteers</small>
            <h4 className="fw-extrabold text-success mb-0">{adminData?.summary?.donorsCount || 0}</h4>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="glass-card p-3 rounded-4 text-center border-start border-4 border-danger">
            <small className="text-muted fw-bold">Pan-India Blood Banks</small>
            <h4 className="fw-extrabold text-danger mb-0">{adminData?.summary?.bloodBanksCount || 0} Facilities</h4>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="glass-card p-3 rounded-4 text-center border-start border-4 border-info">
            <small className="text-muted fw-bold">Hospitals</small>
            <h4 className="fw-extrabold text-info mb-0">{adminData?.summary?.hospitalsCount || 0}</h4>
          </div>
        </div>
        <div className="col-md-3 col-12">
          <div className="glass-card p-3 rounded-4 text-center border-start border-4 border-warning">
            <small className="text-muted fw-bold">Emergency Requests</small>
            <h4 className="fw-extrabold text-warning mb-0">{adminData?.summary?.emergencyRequestsCount || 0} Dispatched</h4>
          </div>
        </div>
      </div>

      {/* Tab Controls & Search Filter */}
      <div className="glass-card p-3 rounded-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="nav nav-pills gap-2">
            <button className={`nav-link fw-bold ${activeTab === 'banks' ? 'active bg-danger' : 'text-dark'}`} onClick={() => setActiveTab('banks')}>
              <FaHospital /> Blood Banks Stores ({adminData?.collections?.bloodBanks?.length || 0})
            </button>
            <button className={`nav-link fw-bold ${activeTab === 'donors' ? 'active bg-success' : 'text-dark'}`} onClick={() => setActiveTab('donors')}>
              <FaHandHoldingHeart /> Donors ({adminData?.collections?.donors?.length || 0})
            </button>
            <button className={`nav-link fw-bold ${activeTab === 'hospitals' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('hospitals')}>
              <FaClinicMedical /> Hospitals ({adminData?.collections?.hospitals?.length || 0})
            </button>
            <button className={`nav-link fw-bold ${activeTab === 'users' ? 'active bg-dark' : 'text-dark'}`} onClick={() => setActiveTab('users')}>
              <FaUsers /> Users ({adminData?.collections?.users?.length || 0})
            </button>
            <button className={`nav-link fw-bold ${activeTab === 'requests' ? 'active bg-warning text-dark' : 'text-dark'}`} onClick={() => setActiveTab('requests')}>
              <FaHeartbeat /> Emergency Requests ({adminData?.collections?.emergencyRequests?.length || 0})
            </button>
          </div>

          <div className="input-group input-group-sm max-w-xs">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabbed Data Tables with Inline Editable Controls */}
      <div className="glass-card p-4 rounded-4 shadow-sm">
        {/* BLOOD BANKS TAB (EDITABLE STOCK) */}
        {activeTab === 'banks' && (
          <div>
            <h5 className="fw-bold text-dark mb-3">Pan-India Blood Banks Stores Database (Editable)</h5>
            <div className="row g-4">
              {adminData?.collections?.bloodBanks?.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.city.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                <div key={b._id} className="col-lg-6">
                  <div className="p-3 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="text-danger fs-6">{b.name}</strong>
                        <div className="small text-muted">{b.city}, {b.state} | {b.phone}</div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${b.location.lat},${b.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary py-0 px-2 rounded-pill fw-bold"
                      >
                        Google Maps <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
                      </a>
                    </div>

                    <div className="small fw-bold text-uppercase text-muted mb-2">Live Inventory Stock Editor:</div>
                    <div className="row g-2">
                      {b.inventory?.map(inv => (
                        <div key={inv.bloodGroup} className="col-6 col-sm-3">
                          <div className="p-2 bg-white rounded border text-center">
                            <span className="badge bg-danger small mb-1">{inv.bloodGroup}</span>
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm text-center fw-bold"
                              value={inv.unitsAvailable}
                              onChange={(e) => handleUpdateBankStock(b._id, inv.bloodGroup, e.target.value)}
                            />
                            <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>Units</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DONORS TAB (EDITABLE DONOR RECORD) */}
        {activeTab === 'donors' && (
          <div>
            <h5 className="fw-bold text-dark mb-3">Volunteers & Donors Database (Editable)</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Blood Group</th>
                    <th>Badge</th>
                    <th>Reward Points</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.collections?.donors?.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.bloodGroup.includes(searchTerm)).map(d => (
                    <tr key={d._id}>
                      <td className="fw-bold">{d.name}</td>
                      <td>{d.email}</td>
                      <td><a href={`tel:${d.phone}`} className="text-decoration-none">{d.phone}</a></td>
                      <td><span className="badge bg-danger fs-6">{d.bloodGroup}</span></td>
                      <td>🏆 {d.badge}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm fw-bold w-75"
                          value={d.points}
                          onChange={(e) => handleUpdateDonorPoints(d._id, e.target.value, d.badge)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleUpdateDonorPoints(d._id, d.points + 50, 'Gold LifeSaver')} className="btn btn-sm btn-outline-success rounded-pill fw-bold">
                          <FaSave /> Save Changes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOSPITALS TAB (EDITABLE ICU BEDS) */}
        {activeTab === 'hospitals' && (
          <div>
            <h5 className="fw-bold text-dark mb-3">Trauma Centers & Hospitals Directory (Editable ICU Beds)</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>Hospital Name</th>
                    <th>Reg No</th>
                    <th>Category</th>
                    <th>Phone</th>
                    <th>ICU Beds Capacity</th>
                    <th>Google Maps</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.collections?.hospitals?.map(h => (
                    <tr key={h._id}>
                      <td className="fw-bold text-primary">{h.name}</td>
                      <td className="font-monospace">{h.registrationNo}</td>
                      <td><span className="badge bg-info text-dark">{h.category}</span></td>
                      <td>{h.phone}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm fw-bold w-50"
                          value={h.emergencyIcuBeds}
                          onChange={(e) => handleUpdateHospitalBeds(h._id, e.target.value)}
                        />
                      </td>
                      <td>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.location.lat},${h.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 rounded-pill fw-bold"
                        >
                          <FaMapMarkerAlt /> Maps <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <h5 className="fw-bold text-dark mb-3">All System Registered Users</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>City / District</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.collections?.users?.map(u => (
                    <tr key={u._id}>
                      <td className="font-monospace text-muted">{u._id}</td>
                      <td className="fw-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td><span className="badge bg-dark text-uppercase">{u.role}</span></td>
                      <td>{u.city}, {u.district}</td>
                      <td><span className="badge bg-success">Verified Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMERGENCY REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div>
            <h5 className="fw-bold text-dark mb-3">All Emergency Patient Requests & Dispatches</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>Ref Code</th>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Blood Needed</th>
                    <th>Units</th>
                    <th>Assigned Bank</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.collections?.emergencyRequests?.map(r => (
                    <tr key={r._id}>
                      <td className="fw-bold text-danger">{r.requestNumber}</td>
                      <td>{r.patientName}</td>
                      <td>{r.contactPhone}</td>
                      <td><span className="badge bg-danger fs-6">{r.bloodGroup}</span></td>
                      <td><strong>{r.unitsRequired} Units</strong></td>
                      <td>{r.assignedBloodBankName}</td>
                      <td><span className="badge bg-success">{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
