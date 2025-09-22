import React from 'react';

const SpaceDetails = ({ space }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>{space.name}</h2>
      <p>{space.location}</p>
      <p>Price: {space.price}</p>
      <img
        src={space.main_image}
        alt={space.name}
        style={{ width: '200px' }}
      />
      <p>{space.description}</p>
    </div>
  );
};

export default SpaceDetails;
