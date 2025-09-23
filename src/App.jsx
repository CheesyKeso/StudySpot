import React from 'react';
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpaceDetails from './pages/SpaceDetails';

export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spaces/:id" element={<SpaceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}