// components/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ show, title, message, onConfirm, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{title || 'Confirm'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message || 'Are you sure?'}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}><i className='bi bi-x me-1' ></i> Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}><i className='bi bi-trash me-1' ></i> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
