import React from 'react';
import { FaCheckCircle, FaQrcode, FaDownload, FaHospital, FaHeartbeat } from 'react-icons/fa';

export default function ReceiptModal({ requestData, onClose }) {
  if (!requestData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="bg-red-gradient p-4 text-white position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaHeartbeat className="fs-3 text-white" />
              <h5 className="modal-title fw-bold text-white mb-0">Emergency Reservation Receipt</h5>
            </div>
            <p className="small mb-0 opacity-90">Present this digital receipt at the assigned blood bank for instant collection.</p>
          </div>

          <div className="modal-body p-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2">
                <FaCheckCircle className="fs-1" />
              </div>
              <h5 className="fw-bold text-dark mb-1">Blood Units Reserved Successfully</h5>
              <span className="badge bg-danger fs-6 px-3 py-2">REF: {requestData.requestNumber || 'REQ-2026-9901'}</span>
            </div>

            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="row g-2 small">
                <div className="col-6 text-muted">Patient Name:</div>
                <div className="col-6 fw-bold text-end text-dark">{requestData.patientName}</div>
                <div className="col-6 text-muted">Blood Group:</div>
                <div className="col-6 fw-bold text-end text-danger fs-6">{requestData.bloodGroup}</div>
                <div className="col-6 text-muted">Units Reserved:</div>
                <div className="col-6 fw-bold text-end text-dark">{requestData.unitsRequired} Units</div>
                <div className="col-6 text-muted">Assigned Blood Bank:</div>
                <div className="col-6 fw-bold text-end text-dark">{requestData.assignedBloodBankName || 'Apex Rotary Central Bank'}</div>
                <div className="col-6 text-muted">Hospital Facility:</div>
                <div className="col-6 fw-bold text-end text-dark">{requestData.hospitalName}</div>
                <div className="col-6 text-muted">Reservation Status:</div>
                <div className="col-6 fw-bold text-end text-success">CONFIRMED (RESERVED)</div>
              </div>
            </div>

            <div className="text-center p-3 rounded-3 border border-secondary border-opacity-25 bg-white">
              <FaQrcode className="fs-1 text-dark mb-2" />
              <div className="small fw-bold text-muted font-monospace">{requestData.qrReceiptCode || 'LL-QR-889102'}</div>
              <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>Scan at dispatch counter for instant priority pickup</small>
            </div>
          </div>

          <div className="modal-footer bg-light p-3 border-top-0 d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2" onClick={handlePrint}>
              <FaDownload /> Print / Save Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
