import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosClient.get('/api/users/profile');
      setUser(data);
    } catch (err) {
      console.error('Failed to load profile', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosClient.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    await loadProfile();
    return data;
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axiosClient.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      await loadProfile();
      toast.success('Account created successfully');
      return true;
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg;
      toast.error(message || 'Registration failed');
      return false;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await axiosClient.put('/api/users/profile', updates);
      setUser(data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Profile update failed', err);
      toast.error(err.response?.data?.msg || 'Failed to update profile');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
