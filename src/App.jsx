import React, { useState, createContext } from 'react';
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SpaceDetails from './pages/SpaceDetails';
import BookingsPage from './pages/BookingsPage';
import './css/topbar.css'; // added: topbar styles

export const AuthContext = createContext({
  user: null,
  signInDemo: () => {},
  signOut: () => {}
});

export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  // --- new: simple auth state available app-wide ---
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ss_user')) || null;
    } catch {
      return null;
    }
  });

  const signInDemo = () => {
    const demo = { name: 'Demo User', email: 'demo@example.com' };
    localStorage.setItem('ss_user', JSON.stringify(demo));
    setUser(demo);
  };

  const signOut = () => {
    localStorage.removeItem('ss_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInDemo, signOut }}>
      <BrowserRouter>
        <div className="topbar">
          <div className="topbar-inner">
            <div className="brand" role="banner">StudySpot</div>
            <div className="topbar-actions">
              {user ? (
                <>
                  <span className="signed-in">Signed in as <strong>{user.name}</strong></span>
                  <Link to="/bookings" className="link-button" style={{ marginLeft: 8 }}>Booked</Link>
                  <button className="link-button" onClick={signOut} style={{ marginLeft: 8 }}>Sign out</button>
                </>
              ) : (
                <button className="primary-btn" onClick={signInDemo}>Sign in</button>
              )}
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}