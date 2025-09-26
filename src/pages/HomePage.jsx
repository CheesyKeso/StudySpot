import React from 'react';
import SearchBar from '../components/SearchBar';
import '../css/HomePage.css';

const HomePage = () => {
  return (
    <>
      <div className="home-page">
        <SearchBar />
      </div>
    </>
  );
};

export default HomePage;