import React from 'react';

const Modal = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="modal-actions">
          {onConfirm && (
            <button onClick={onConfirm} className="btn-confirm btn">Confirm</button>
          )}
          <button onClick={onClose} className="btn-close btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
