import React, { useEffect, useRef, useState } from 'react';
import '../css/BookingModal.css';
import ConfirmBookingModal from './ConfirmBookingModal';

const BookingModal = ({ open, onClose, space, user, onBooked }) => {
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [status, setStatus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewBooking, setPreviewBooking] = useState(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // focus first actionable control
    confirmRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // reset state when closed
      setDate('');
      setSelectedSlot('');
      setAttendees(1);
      setStatus(null);
      setShowConfirm(false);
      setPreviewBooking(null);
    }
  }, [open]);

  if (!open || !space) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    if (!user) {
      setStatus({ success: false, message: 'You must be signed in to book.' });
      return;
    }
    if (!date) {
      setStatus({ success: false, message: 'Please choose a date.' });
      return;
    }
    if (!selectedSlot) {
      setStatus({ success: false, message: 'Please select a time slot.' });
      return;
    }

    // compute amount using numeric values
    const numericAttendees = Number(attendees) || 0;
    const pricePer = Number(space?.price) || 0;
    const amount = pricePer * numericAttendees;

    // prepare preview and open confirmation modal (do not persist yet)
    const preview = {
      spaceId: space.id,
      spaceName: space.name,
      user,
      date,
      slot: selectedSlot,
      attendees: numericAttendees,
      pricePer,
      amount
    };
    setPreviewBooking(preview);
    setShowConfirm(true);
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPreviewBooking(null);
  };

  const handleFinalConfirm = () => {
    if (!previewBooking) return;
    try {
      const booking = {
        id: `bk_${Date.now()}`,
        ...previewBooking,
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('ss_bookings') || '[]');
      existing.push(booking);
      localStorage.setItem('ss_bookings', JSON.stringify(existing));
      // notify parent
      if (onBooked) onBooked({ success: true, message: `Booked ${booking.slot} on ${booking.date}. Reference: ${booking.id}`, booking });
      // close immediately so page scrolling is restored
      setShowConfirm(false);
      setPreviewBooking(null);
      onClose();
      // update status (optional — modal is closed so this is mainly for any parent)
      setStatus({ success: true, message: `Booked ${booking.slot} on ${booking.date}. Reference: ${booking.id}` });
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: 'Failed to save booking.' });
    }
  };

  return (
    <>
      <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-dialog booking-modal" role="document" onClick={(e) => e.stopPropagation()}>
          <h3>Book a slot — {space.name}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Choose date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="form-row">
              <label>Time slot</label>
              <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                <option value="">-- select a slot --</option>
                {space.time_slots?.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-row">
              <label>Attendees</label>
              <input type="number" min="1" value={attendees} onChange={(e) => setAttendees(Number(e.target.value))} />
            </div>

            <div className="modal-actions">
              <button type="button" className="primary-btn" onClick={onClose}>Cancel</button>
              <button ref={confirmRef} type="submit" className="primary-btn">Confirm Booking</button>
            </div>

            {status && (
              <div className={status.success ? 'form-success' : 'form-error'} style={{ marginTop: 8 }}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>

      <ConfirmBookingModal
        open={showConfirm}
        bookingPreview={previewBooking}
        onCancel={handleCancelConfirm}
        onConfirm={handleFinalConfirm}
      />
    </>
  );
};

export default BookingModal;
