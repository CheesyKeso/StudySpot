import React, { useState, createContext } from 'react';
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpaceDetails from './pages/SpaceDetails';
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
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand" role="banner">StudySpot</div>
          <div className="topbar-actions">
            {user ? (
              <>
                <span className="signed-in">Signed in as <strong>{user.name}</strong></span>
                <button className="link-button" onClick={signOut}>Sign out</button>
              </>
            ) : (
              <button className="primary-btn" onClick={signInDemo}>Sign in</button>
            )}
          </div>
        </div>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}