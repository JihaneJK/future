import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier le token au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authAPI.getUser();
        // Handle both formats: { user } or direct user object
        setUser(userData.user || userData);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      
      // Extract user and token - handle different response formats
      const token = data.token || data.access_token;
      const userData = data.user || data;
      
      console.log('[AuthContext] API login response:', JSON.stringify(data));
      console.log('[AuthContext] Extracted userData:', JSON.stringify(userData));
      console.log('[AuthContext] userData.role:', userData?.role);
      
      if (!token) {
        throw new Error('Token manquant');
      }
      
      localStorage.setItem('token', token);
      console.log('[AuthContext] Token stored in localStorage');
      
      setUser(userData);
      console.log('[AuthContext] setUser called with role:', userData?.role);
      
      return { user: userData, token };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erreur de connexion';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authAPI.register(userData);
      
      // Extract user and token - handle different response formats
      const token = data.token || data.access_token;
      const user = data.user || data;
      
      if (!token) {
        throw new Error('Token manquant');
      }
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { user, token };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Erreur d'inscription";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignorer l'erreur
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};