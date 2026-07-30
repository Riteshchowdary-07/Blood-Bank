import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ReceiptModal from './ReceiptModal';
import { FaClipboardList, FaQrcode, FaCheckCircle, FaClock, FaHeartbeat } from 'react-icons/fa';

export default function OrdersModal({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    api.get('/emergency/requests').then(res => setOrders(res.data.data || []));
  }, []);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="bg-red-gradient text-white p-4">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaClipboardList className="fs-3 text-white" />
              <h5 className="modal-title fw-bold text-white mb-0">Emergency Order Details & Request History</h5>
            </div>
            <p className="small mb-0 opacity-90">View all past blood reservations, ref codes, status badges, and digital QR receipts.</p>
          </div>

          <div className="modal-body p-4">
            {orders.length === 0 ? (
              <div className="alert alert-info">No past blood reservation orders found.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((ord) => (
                  <div key={ord._id} className="p-3 bg-light rounded-4 border border-danger border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-danger fs-6">{ord.bloodGroup}</span>
                        <strong className="text-dark fs-6">{ord.unitsRequired} Units Reserved</strong>
                        <span className="badge bg-success text-uppercase">{ord.status || 'CONFIRMED'}</span>
                      </div>
                      <div className="small text-dark font-monospace fw-bold me-2">REF: {ord.requestNumber}</div>
                      <small className="text-muted d-block">{ord.assignedBloodBankName || 'LifeLink National HQ Blood Bank'} ({ord.district})</small>
                    </div>

                    <button onClick={() => setSelectedReceipt(ord)} className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
                      <FaQrcode /> View Digital QR Receipt
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer bg-light p-3 border-top-0">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal requestData={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
