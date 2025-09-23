import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/SpaceCard.css'; // reuse some styles, adjust as needed

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <button className="primary-btn" onClick={() => alert('Booking flow not implemented')}>Book</button>
            <button className="link-button" onClick={() => navigate(-1)}>Close</button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SpaceDetails;
