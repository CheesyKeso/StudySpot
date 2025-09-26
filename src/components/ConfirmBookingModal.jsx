import React, { useEffect, useRef } from 'react';
import '../css/BookingModal.css';

const ConfirmBookingModal = ({ open, bookingPreview, onCancel, onConfirm }) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // don't touch document.body.style.overflow here — BookingModal manages scroll locking.
    confirmRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  if (!open || !bookingPreview) return null;

  const fmt = (v) => {
    try {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(v) || 0);
    } catch {
      return `₱${v}`;
    }
  };

  const pricePer = bookingPreview.pricePer ?? 0;
  const amount = bookingPreview.amount ?? (pricePer * (bookingPreview.attendees || 0));

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="modal-dialog booking-modal" role="document" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm booking — {bookingPreview.spaceName}</h3>

        <div className="form-row">
          <label>When</label>
          <div>{bookingPreview.date} @ {bookingPreview.slot}</div>
        </div>

        <div className="form-row">
          <label>Attendees</label>
          <div>{bookingPreview.attendees}</div>
        </div>

        <div className="form-row">
          <label>Price (per attendee)</label>
          <div>{fmt(pricePer)}</div>
        </div>

        <div className="form-row">
          <label>Total amount</label>
          <div>{fmt(amount)}</div>
        </div>

        <div className="form-row">
          <label>Booked by</label>
          <div>{bookingPreview.user?.name || bookingPreview.user?.email || 'Unknown'}</div>
        </div>

        <div className="modal-actions">
          <button type="button" className="primary-btn" onClick={onCancel}>Back</button>
          <button ref={confirmRef} type="button" className="primary-btn" onClick={onConfirm}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingModal;
