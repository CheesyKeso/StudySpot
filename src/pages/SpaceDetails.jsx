import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SpaceCard.css'; // reuse some styles, adjust as needed
import '../css/booking.css'; // added: booking form styles
import { AuthContext } from '../App.jsx';

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

  if (loading) return <div className="page-container">Loading...</div>;
  if (!space) return <div className="page-container">Space not found. <button onClick={() => navigate(-1)}>Back</button></div>;

  return (
    <div className="page-container" style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
      <article className="card" aria-labelledby={`detail-${space.id}-title`}>
        <img className="card-image" src={space.main_image} alt={space.name} />
        <div className="card-body">
          <h2 id={`detail-${space.id}-title`}>{space.name}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>₱{space.price}</div>
            <div style={{ marginLeft: 'auto', color: '#6b7280' }}>{space.location}</div>
          </div>
          <p style={{ marginTop: 8 }}>{space.description}</p>

          <h4>Amenities</h4>
          <ul>
            {space.amenities?.map((a, i) => <li key={i}>{a}</li>)}
          </ul>

          <h4>Hours & Time Slots</h4>
          <p>{space.hours}</p>
          <ul>
            {space.time_slots?.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {/* keep simple CTA as well */}
          </div>

          {/* --- Booking form (visible if user signed in) --- */}
          <section style={{ marginTop: 18 }}>
            {!user ? (
              <div className="booking-form">
                <p style={{ margin: 0 }}>Sign in via the top-right "Sign in" button to make a booking.</p>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleBook}>
                <h3>Book a slot</h3>

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

                <div className="form-row" style={{ marginTop: 8 }}>
                  <button type="submit" className="primary-btn">Confirm Booking</button>
                </div>

                {bookingStatus && (
                  <div className={bookingStatus.success ? 'form-success' : 'form-error'} style={{ marginTop: 8 }}>
                    {bookingStatus.message}
                  </div>
                )}
              </form>
            )}
          </section>
        </div>
      </article>
    </div>
  );
};

export default SpaceDetails;
