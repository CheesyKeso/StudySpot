import React, { useState, useEffect } from 'react';
import '../css/SearchBar.css';
import SpaceCard from './SpaceCard';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch('/spaces.json');
        const data = await response.json();
        setSpaces(data);
        setFilteredSpaces(data);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    setFilteredSpaces(
      spaces.filter((space) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          space.name.toLowerCase().includes(q) ||
          (space.location && space.location.toLowerCase().includes(q))
        );
      })
    );
  }, [searchQuery, spaces]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find your perfect study spot</h1>
        <p>Search, preview and book comfortable spaces near you.</p>
      </div>

      <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="searchInput"
          placeholder="Search for a study spot"
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search study spots"
        />
      </form>

      <div className="results-grid" aria-live="polite">
        {filteredSpaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

