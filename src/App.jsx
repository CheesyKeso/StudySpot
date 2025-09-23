import React from 'react';
import { usePWA } from './hooks/usePWA';
import HomePage from './pages/HomePage';

export default function App() {
  const { isInstallable, installApp, isOnline } = usePWA();

  return (
    <HomePage />
  );
}