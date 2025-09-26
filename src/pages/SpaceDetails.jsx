import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SpaceDetails.css'; // scoped styles for the SpaceDetails page
import { AuthContext } from '../context/AuthContext'; // updated import
import BookingModal from '../components/BookingModal'; // new modal component

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- new: booking state ---
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null); // { success: bool, message: string }

  // NEW: modal open state
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await fetch('/spaces.json');
        const data = await res.json();
        const found = data.find((s) => String(s.id) === String(id));
        setSpace(found || null);
      } catch (err) {
        console.error(err);
        setSpace(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  const handleBook = (e) => {
    e.preventDefault();
    setBookingStatus(null);

    if (!user) {
      setBookingStatus({ success: false, message: 'You must be signed in to book.' });
      return;
    }
    if (!date) {
      setBookingStatus({ success: false, message: 'Please choose a date.' });
      return;
    }
    if (!selectedSlot) {
      setBookingStatus({ success: false, message: 'Please select a time slot.' });
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
      setBookingStatus({ success: true, message: `Booked ${selectedSlot} on ${date}. Reference: ${booking.id}` });
      setDate('');
      setSelectedSlot('');
      setAttendees(1);
    } catch (err) {
      console.error(err);
      setBookingStatus({ success: false, message: 'Failed to save booking.' });
    }
  };

  // small helpers for rating
  const ratingNum = space?.rating ? Number(space.rating) : null;
  const ratingCount = space?.rating_count ? Number(space.rating_count) : 0;
  const ratingLabel = ratingNum === null ? '' : ratingNum <= 5 ? 'Bad' : ratingNum >= 8.5 ? 'Fabulous' : ratingNum >= 7 ? 'Very good' : 'Good';
  const formattedCount = new Intl.NumberFormat().format(ratingCount);

  if (loading) return <div className="page-container">Loading...</div>;
  if (!space) return <div className="page-container">Space not found. <button className="back-btn" onClick={() => navigate(-1)}>Back</button></div>;

  return (
    <div className="page-container space-details">
      <article className="card detail-card" aria-labelledby={`detail-${space.id}-title`}>
        <div className="card-body detail-body">
          <header className="detail-header">
            {/* Name */}
            <h2 id={`detail-${space.id}-title`}>{space.name}</h2>
            {/* Location */}
            <div className="detail-location">{space.location}</div>
            {/* ...rating removed from header so it can sit next to price... */}
          </header>

          {/* Image (moved below header to match requested order) */}
          <img className="card-image" src={space.main_image} alt={space.name} />

          {/* Details (price, description, amenities, hours, booking) */}
          <div className="detail-meta" style={{ marginTop: 8 }}>
            <div className="detail-price">₱{space.price}</div>

            {/* moved rating here so it displays right next to the price */}
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
          {/* About subtitle (new) */}
          <div className="detail-about">
            <h3 className="detail-subtitle">About this space</h3>
            <p className="detail-description">{space.description}</p>
          </div>

          <div className="detail-sections">
            <section className="detail-amenities detail-box">
              <h4>Amenities</h4>
              <ul>
                {space.amenities?.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </section>

            <section className="detail-hours detail-box">
              <h4>Hours & Time Slots</h4>
              <p>{space.hours}</p>
              <h4>Available Slot</h4>
              <ul>
                {space.time_slots?.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>
          </div>

          <section className="detail-booking">
            {!user ? (
              <div className="booking-form">
                <p style={{ margin: 0 }}>Sign in via the top-right "Sign in" button to make a booking.</p>
              </div>
            ) : (
              <div className="booking-action">
                <button className="primary-btn" onClick={() => setModalOpen(true)}>Book a slot</button>
                {bookingStatus && (
                  <div className={bookingStatus.success ? 'form-success' : 'form-error'} aria-live="polite">
                    {bookingStatus.message}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </article>

      {/* Booking modal instance */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        space={space}
        user={user}
        onBooked={(result) => {
          // result = { success: bool, message: string, booking? }
          setBookingStatus(result);
        }}
      />
    </div>
  );
};

export default SpaceDetails;

