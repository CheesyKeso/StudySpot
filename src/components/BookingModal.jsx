import React, { useEffect, useRef, useState } from 'react';
import '../css/BookingModal.css';

const BookingModal = ({ open, onClose, space, user, onBooked }) => {
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [status, setStatus] = useState(null);
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

    const booking = {
      id: `bk_${Date.now()}`,
      spaceId: space.id,
      spaceName: space.name,
      user,
      date,
      slot: selectedSlot,
      attendees: Number(attendees),
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('ss_bookings') || '[]');
      existing.push(booking);
      localStorage.setItem('ss_bookings', JSON.stringify(existing));
      setStatus({ success: true, message: `Booked ${selectedSlot} on ${date}. Reference: ${booking.id}` });
      if (onBooked) onBooked({ success: true, message: `Booked ${selectedSlot} on ${date}. Reference: ${booking.id}`, booking });
      // close shortly after success
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: 'Failed to save booking.' });
    }
  };

  return (
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
            <input type="number" min="1" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="button" className="link-button" onClick={onClose}>Cancel</button>
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
  );
};

export default BookingModal;
