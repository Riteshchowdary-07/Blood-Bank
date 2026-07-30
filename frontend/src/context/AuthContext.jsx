import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lifelink_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lifelink_token') || null);

  const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('lifelink_user', JSON.stringify(res.data.user));
      localStorage.setItem('lifelink_token', res.data.token);
    }
    return res.data;
  };

  const registerUser = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('lifelink_user', JSON.stringify(res.data.user));
      localStorage.setItem('lifelink_token', res.data.token);
    }
    return res.data;
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lifelink_user');
    localStorage.removeItem('lifelink_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
