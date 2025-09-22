import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';

export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}