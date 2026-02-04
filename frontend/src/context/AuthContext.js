import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token by fetching current user
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      
      toast.success('Login successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios headers
    delete api.defaults.headers.common['Authorization'];
    
    // Clear state
    setUser(null);
    
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: () => !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};