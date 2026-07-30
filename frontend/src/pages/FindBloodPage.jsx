import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AiMatchCard from '../components/AiMatchCard';
import InteractiveMap from '../components/InteractiveMap';
import ReceiptModal from '../components/ReceiptModal';
import { FaSearch, FaFilter, FaLayerGroup, FaMapMarkerAlt } from 'react-icons/fa';

export default function FindBloodPage() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedGroup, districtFilter]);

  const fetchData = async () => {
    try {
      const bankParams = {};
      if (selectedGroup !== 'All') bankParams.bloodGroup = selectedGroup;
      if (districtFilter) bankParams.district = districtFilter;

      const resBank = await api.get('/blood-banks', { params: bankParams });
      const resDonor = await api.get('/donors', { params: { bloodGroup: selectedGroup !== 'All' ? selectedGroup : undefined } });

      setBloodBanks(resBank.data.data || []);
      setDonors(resDonor.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReserve = async (bank) => {
    try {
      const res = await api.post('/emergency/request', {
        patientName: 'Emergency Patient',
        contactPhone: '+91 98000 11122',
        bloodGroup: selectedGroup !== 'All' ? selectedGroup : 'O+',
        unitsRequired: 2,
        hospitalName: 'General Hospital',
        district: bank.district,
        assignedBloodBankId: bank._id
      });
      if (res.data.success) {
        setReceiptData(res.data.request);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Find Compatible Blood Stock</h2>
          <p className="text-muted small mb-0">Search real-time inventory across verified blood banks and active donors.</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card p-3 mb-4 rounded-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <label className="small fw-bold text-muted mb-1">Filter by Blood Group</label>
            <div className="d-flex flex-wrap gap-1">
              {['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <button
                  key={bg}
                  className={`btn btn-sm ${selectedGroup === bg ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedGroup(bg)}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-5">
            <label className="small fw-bold text-muted mb-1">Filter by District / City</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text"><FaMapMarkerAlt className="text-danger" /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search district e.g. Central Delhi"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-2 text-end">
            <button className="btn btn-sm btn-medical w-100 py-2 fw-semibold" onClick={fetchData}>
              <FaFilter /> Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <h5 className="fw-bold text-dark mb-3">Matching Facilities ({bloodBanks.length})</h5>
          {bloodBanks.length === 0 ? (
            <div className="alert alert-warning">No blood banks matching selected group/district found.</div>
          ) : (
            bloodBanks.map((bank) => (
              <AiMatchCard key={bank._id} item={bank} type="bank" onReserve={handleReserve} />
            ))
          )}
        </div>

        <div className="col-lg-6">
          <h5 className="fw-bold text-dark mb-3">Map View</h5>
          <InteractiveMap bloodBanks={bloodBanks} donors={donors} onReserveClick={handleReserve} />
        </div>
      </div>

      {receiptData && (
        <ReceiptModal requestData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
}
