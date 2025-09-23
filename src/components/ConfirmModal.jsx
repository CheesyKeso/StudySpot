import React, { useEffect, useRef } from 'react';
import '../css/confirm-modal.css';

const ConfirmModal = ({ open, booking, onConfirm, onCancel }) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // focus confirm button when opened
    confirmRef.current?.focus();
    // lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open || !booking) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="modal-overlay"
      onClick={onCancel} // click outside to dismiss
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="modal-dialog"
      >
        <h3 id="confirm-title">Cancel booking?</h3>
        <div className="confirm-modal-body">
          <p>Are you sure you want to cancel the booking for</p>
          <p className="confirm-space"><strong>{booking.spaceName}</strong></p>
          <p className="confirm-date"><strong>{booking.date}</strong><span className="confirm-slot"> ({booking.slot})</span></p>
        </div>
        <div className="modal-actions">
          <button className="link-button" onClick={onCancel}>Keep booking</button>
          <button ref={confirmRef} className="primary-btn" onClick={onConfirm}>Yes, cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

