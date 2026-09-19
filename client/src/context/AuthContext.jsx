import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kenzna_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user profile if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Session expired or invalid token:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('kenzna_token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success(`مرحباً بعودتك، ${data.name}! 👋`);
      return data;
    } catch (error) {
      toast.error(error.message || 'فشل تسجيل الدخول');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('kenzna_token', data.token);
      setToken(data.token);
      setUser(data);
      toast.success('تم إنشاء حسابك بنجاح! مرحباً بك في كنزنا 🎉');
      return data;
    } catch (error) {
      toast.error(error.message || 'فشل إنشاء الحساب');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('kenzna_token');
    setToken(null);
    setUser(null);
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/users/profile', profileData);
      setUser(prev => ({ ...prev, ...data }));
      toast.success('تم تحديث البيانات بنجاح ✅');
      return data;
    } catch (error) {
      toast.error(error.message || 'فشل تحديث البيانات');
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
