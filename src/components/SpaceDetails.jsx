import React from 'react';

const modalStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
  padding: 20,
};

const panelStyle = {
  background: '#fff',
  borderRadius: 8,
  maxWidth: 900,
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  padding: 20,
};

export default function SpaceDetails({ space, onClose }) {
  if (!space) return null;

  return (
    <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby={`detail-${space.id}-title`}>
      <div style={panelStyle}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <h2 id={`detail-${space.id}-title`} style={{ margin: 0 }}>{space.name}</h2>
          <div style={{ marginLeft: 'auto', fontWeight: 700 }}>₱{space.price}</div>
          <button onClick={onClose} aria-label="Close details" style={{ marginLeft: 12 }}>Close</button>
        </div>

        <p style={{ color: '#6b7280', marginTop: 6 }}>{space.location}</p>

        {space.images && space.images.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
            {space.images.map((src, i) => (
              <img key={i} src={src} alt={`${space.name} ${i + 1}`} style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <img src={space.main_image} alt={space.name} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 6, marginTop: 12 }} />
        )}

        <p style={{ marginTop: 12 }}>{space.description}</p>

        <div style={{ marginTop: 12 }}>
          <strong>Amenities</strong>
          <ul>
            {space.amenities && space.amenities.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          <div><strong>Hours:</strong> {space.hours}</div>
          <div><strong>Time slots:</strong> {space.time_slots?.join(', ')}</div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose}>Close</button>
          <button onClick={() => alert('Booking flow not implemented')}>Book</button>
        </div>
      </div>
    </div>
  );
}
