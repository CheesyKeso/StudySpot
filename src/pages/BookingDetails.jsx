import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SpaceDetails.css';
import { AuthContext } from '../context/AuthContext';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = JSON.parse(localStorage.getItem('ss_bookings') || '[]');
        const found = all.find((b) => String(b.id) === String(id)) || null;
        setBooking(found);
        if (found) {
          try {
            const res = await fetch('/spaces.json');
            const data = await res.json();
            const sp = data.find((s) => String(s.id) === String(found.spaceId)) || null;
            setSpace(sp);
          } catch (e) {
            // ignore missing spaces.json; space remains null
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const fmt = (v) => {
    try {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(v) || 0);
    } catch {
      return `₱${v}`;
    }
  };

  // --- new: rating helpers (same logic as SpaceDetails) ---
  const ratingNum = space?.rating ? Number(space.rating) : null;
  const ratingCount = space?.rating_count ? Number(space.rating_count) : 0;
  const ratingLabel = ratingNum === null ? '' : ratingNum <= 5 ? 'Bad' : ratingNum >= 8.5 ? 'Fabulous' : ratingNum >= 7 ? 'Very good' : 'Good';
  const formattedCount = new Intl.NumberFormat().format(ratingCount);

  if (loading) return <div className="page-container">Loading...</div>;

  // require sign-in to view booking
  if (!user) {
    return (
      <div className="page-container">
        <h2>Booking details</h2>
        <p>You must sign in to view booking details. Use the "Sign in" button at the top right.</p>
      </div>
    );
  }

  if (!booking) return <div className="page-container">Booking not found. <button className="back-btn" onClick={() => navigate(-1)}>Back</button></div>;

  // restrict viewing to booking owner
  if (booking.user?.email && booking.user.email !== user.email) {
    return (
      <div className="page-container">
        <h2>Booking details</h2>
        <p>You do not have permission to view this booking.</p>
        <button className="primary-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  const pricePer = Number(booking.pricePer ?? booking.price ?? space?.price ?? 0) || 0;
  const amount = Number(booking.amount ?? (pricePer * (booking.attendees || 0))) || 0;

  return (
    <div className="page-container space-details">
      <article className="card detail-card" aria-labelledby={`booking-${booking.id}-title`}>
        <div className="card-body detail-body">
          <header className="detail-header">
            <h2 id={`booking-${booking.id}-title`}>{booking.spaceName || 'Booking'}</h2>
            <div className="detail-location">{space?.location || ''}</div>
          </header>

          {space?.main_image && <img className="card-image" src={space.main_image} alt={booking.spaceName || 'space image'} />}

          <div className="detail-meta" style={{ marginTop: 8 }}>
            <div className="detail-price">{space ? `₱${space.price}` : fmt(pricePer)}</div>

            {/* --- new: rating inline (matches SpaceDetails) --- */}
            {ratingNum !== null && (
              <div className="rating-inline" aria-hidden>
                <div className="rating-badge">{ratingNum.toFixed(1)}</div>
                <div className="rating-meta">
                  <div className="rating-label">{ratingLabel}</div>
                  <div className="rating-count">{formattedCount} reviews</div>
                </div>
              </div>
            )}
          </div>

          <div className="detail-about">
            <h3 className="detail-subtitle">Booking details</h3>
            <p className="detail-description">
              Date: {booking.date} • Slot: {booking.slot} • Attendees: {booking.attendees}
            </p>
            <p className="detail-description">
              Price per attendee: {fmt(pricePer)} • Total amount: {fmt(amount)}
            </p>
            <p className="detail-description">Booked at: {new Date(booking.createdAt).toLocaleString()}</p>
            {booking.user && <p className="detail-description">Booked by: {booking.user.name} ({booking.user.email})</p>}
          </div>

          {space && (
            <div className="detail-sections" style={{ marginTop: 10 }}>
              <section className="detail-amenities detail-box">
                <h4>About the space</h4>
                <p style={{ margin: 0 }}>{space.description}</p>
                <ul style={{ marginTop: 8 }}>
                  {space.amenities?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </section>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BookingDetails;
