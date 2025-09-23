import React from 'react';
import '../css/SpaceCard.css';
import { useNavigate } from 'react-router-dom';

const SpaceCard = ({ space, onViewDetails }) => {
  const navigate = useNavigate();

  const handleView = () => {
    if (onViewDetails) {
      onViewDetails(space);
    } else {
      navigate(`/spaces/${space.id}`);
    }
  };

  return (
    // make the full card clickable and keyboard-accessible
    <article
      className="card clickable"
      aria-labelledby={`card-${space.id}-title`}
      role="button"
      tabIndex={0}
      onClick={handleView}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleView();
        }
      }}
    >
      <img className="card-image" src={space.main_image} alt={space.name} />
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 id={`card-${space.id}-title`} className="card-title">{space.name}</h3>
          <div style={{ marginLeft: 'auto', fontWeight: 700 }} className="card-price">₱{space.price}</div>
        </div>
        <p className="card-sub">{space.location}</p>
        <p style={{ margin: 4, color: '#4b5563', fontSize: 13 }}>
          {space.description?.slice(0, 110)}{space.description && space.description.length > 110 ? '…' : ''}
        </p>
      </div>
    </article>
  );
};

export default SpaceCard;



