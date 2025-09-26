import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // updated import
import '../css/BookingPage.css';
import ConfirmModal from '../components/ConfirmModal'; // added import

const BookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // NEW: temporarily remove the body background while on this page
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = {
      background: document.body.style.background,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundAttachment: document.body.style.backgroundAttachment
    };
    // Clear any background so the gradient from Topbar.css doesn't show
    document.body.style.background = 'none';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundAttachment = '';
    return () => {
      // restore previous inline styles
      document.body.style.background = prev.background || '';
      document.body.style.backgroundRepeat = prev.backgroundRepeat || '';
      document.body.style.backgroundAttachment = prev.backgroundAttachment || '';
    };
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(null); // booking id (or full booking) pending cancel

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('ss_bookings') || '[]');
    setBookings(all);
  }, []);

  const userBookings = bookings.filter((b) =>
    user ? b.user?.email === user.email : false
  );


  const fmt = (v) => {
    try {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v);
    } catch {
      return `₱${v}`;
    }
  };

  // REPLACE: cancelBooking now opens confirmation modal instead of immediately removing
  const requestCancelBooking = (id) => {
    const toCancel = bookings.find((b) => b.id === id);
    setPendingCancel(toCancel || { id });
    setShowConfirm(true);
  };

  const confirmCancelBooking = () => {
    if (!pendingCancel) {
      setShowConfirm(false);
      setPendingCancel(null);
      return;
    }
    const remaining = bookings.filter((b) => b.id !== pendingCancel.id);
    localStorage.setItem('ss_bookings', JSON.stringify(remaining));
    setBookings(remaining);
    setShowConfirm(false);
    setPendingCancel(null);
  };

  const dismissConfirm = () => {
    setShowConfirm(false);
    setPendingCancel(null);
  };

  if (!user) {
    return (
      <div className="page-container">
        <h2>Your Bookings</h2>
        <p>You must sign in to view your bookings. Use the "Sign in" button at the top right.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Your Bookings</h2>
      {userBookings.length === 0 ? (
        <p>No bookings found for {user.name}.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {userBookings.map((b) => {
            // compute pricePer and amount with fallbacks
            const pricePer = Number(b.pricePer ?? b.price ?? 0) || 0;
            const amount = Number(b.amount ?? (pricePer * (b.attendees || 0))) || 0;

            return (
              <article key={b.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <strong style={{ fontSize: 16, marginRight: 8, cursor: 'pointer' }} onClick={() => navigate(`/bookings/${b.id}`)}>
                        {b.spaceName}
                      </strong>
                      <div style={{ marginLeft: 'auto', fontWeight: 700 }}>Ref: {b.id}</div>
                    </div>
                    <div style={{ color: '#6b7280', marginTop: 6 }}>
                      Date: {b.date} • Slot: {b.slot} • Attendees: {b.attendees}
                    </div>

                    {/* NEW: display price per attendee and total amount */}
                    <div style={{ color: '#374151', marginTop: 8, fontSize: 14 }}>
                      <div>Price per attendee: {fmt(pricePer)}</div>
                      <div>Total amount: {fmt(amount)}</div>
                    </div>

                    <div style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
                      Booked at: {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button className="primary-btn" onClick={() => navigate(`/bookings/${b.id}`)}>View Booking</button>
                    <button className="primary-btn" onClick={() => requestCancelBooking(b.id)}>Cancel</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        booking={pendingCancel}
        onConfirm={confirmCancelBooking}
        onCancel={dismissConfirm}
      />
    </div>
  );
};

export default BookingsPage;

