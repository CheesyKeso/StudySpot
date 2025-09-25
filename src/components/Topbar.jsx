import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Topbar.css';

const Topbar = () => {
  const { user, signInDemo, signOut } = useContext(AuthContext);

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" role="banner">StudySpot</Link>
        <div className="topbar-actions">
          {user ? (
            <>
              <span className="signed-in">Signed in as <strong>{user.name}</strong></span>
              <Link to="/bookings" className="link-button">Bookings</Link>
              <button className="link-button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button className="primary-btn" onClick={signInDemo}>Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
