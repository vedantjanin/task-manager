// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// Provider component to wrap around the app
export const AuthProvider = ({ children }) => {
  // State to store current user info
  const [user, setUser] = useState(null);
  // State to show loading while checking login status
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on first render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make request to backend to get logged-in user
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setUser(res.data.user); // Set user if logged in
      } catch (err) {
        setUser(null); // No user logged in
      } finally {
        setLoading(false); // Done loading
      }
    };
    fetchUser();
  }, []);

  // Function to handle login
  const login = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        data,
        { withCredentials: true } // send cookies for session
      );
      setUser(res.data.user); // Save user after login
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  // Function to handle registration
  const register = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        data,
        { withCredentials: true }
      );
      setUser(res.data.user); // Save user after registration
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null); // Clear user after logout
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context easily
export const useAuth = () => useContext(AuthContext);
