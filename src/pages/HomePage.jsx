import React from 'react';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  return (
    <div className="page-container">
      <h1 style={{ display: 'none' }}>StudySpot Home</h1>
      <SearchBar />
    </div>
  );
};

export default HomePage;