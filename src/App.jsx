import React, { useContext } from 'react';
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SpaceDetails from './pages/SpaceDetails';
import BookingsPage from './pages/BookingsPage';
import BookingDetails from './pages/BookingDetails'; // added import
import './css/topbar.css'; // added: topbar styles
import { AuthProvider, AuthContext } from './context/AuthContext'; // moved auth context
import Topbar from './components/Topbar'; // new topbar component

export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// nested component consumes the moved AuthContext
function AppContent() {
  const { user, signInDemo, signOut } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {/* replaced inline topbar markup with Topbar component */}
      <Topbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spaces/:id" element={<SpaceDetails />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetails />} /> {/* added route */}
      </Routes>
    </BrowserRouter>
  );
}