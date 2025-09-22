import React, { useState, useEffect } from 'react';
import '../css/SearchBar.css';
import SpaceDetails from './SpaceDetails'; // Import SpaceDetails

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
      spaces.filter((space) =>
        space.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, spaces]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="searchInput"
          placeholder="Search for a study spot..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearch} // Trigger filtering on input change
        />
      </form>
      <div>
        {filteredSpaces.map((space) => (
          <SpaceDetails key={space.id} space={space} /> // Use SpaceDetails
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
