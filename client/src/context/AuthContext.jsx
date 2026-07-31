import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current logged-in user
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.status === 'success') {
          setUser(data.user);
        } else {
          // Token expired or invalid
          Cookies.remove('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Cookies.remove('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.status !== 'success') {
        throw new Error(data.message || 'Login failed');
      }

      // Save token in cookie (expires in 30 days)
      Cookies.set('token', data.token, { expires: 30 });
      setUser(data.user);
      return data.user;
    } catch (error) {
      // Extract message from axios error response
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  // Register handler
  const register = async ({ fullName, email, mobileNumber, password, referralCode }) => {
    try {
      const { data } = await api.post('/auth/register', {
        fullName, email, mobileNumber, password, referralCode
      });
      if (data.status !== 'success') {
        // Handle error messages from zod array
        if (data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].message);
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Save token in cookie (expires in 30 days)
      Cookies.set('token', data.token, { expires: 30 });
      setUser(data.user);
      return data.user;
    } catch (error) {
      const resData = error.response?.data;
      if (resData?.errors && resData.errors.length > 0) {
        throw new Error(resData.errors[0].message);
      }
      const message = resData?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  // Reload profile handler
  const reloadUser = async () => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      if (data.status === 'success') {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error reloading user profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
