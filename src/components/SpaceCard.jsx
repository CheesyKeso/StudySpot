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

  // small helpers
  const ratingNum = space?.rating ? Number(space.rating) : null;
  const ratingCount = space?.rating_count ? Number(space.rating_count) : 0;
  const ratingLabel = ratingNum >= 8.5 ? 'Fabulous' : ratingNum >= 7 ? 'Very good' : 'Good';
  const formattedCount = new Intl.NumberFormat().format(ratingCount);

  return (
    // make the full card clickable and keyboard-accessible
    <article
      className="card clickable space-card" // added space-card to scope styles
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
        <div className="card-body-top">
          <h3 id={`card-${space.id}-title`} className="card-title">{space.name}</h3>

          <p className="card-sub" style={{ marginTop: 8 }}>{space.location}</p>

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
      </div>

      {/* moved: price rendered as floating element so CSS can pin it bottom-right */}
      <div className="card-price floating">₱{space.price}</div>
    </article>
  );
};

export default SpaceCard;



