import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  signInDemo: () => {},
  signOut: () => {}
});

export const AuthProvider = ({ children }) => {
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
      {children}
    </AuthContext.Provider>
  );
};
