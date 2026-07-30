import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

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
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          setUser(data.user);
        } else {
          // Token expired or invalid
          Cookies.remove('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Login failed');
      }

      // Save token in cookie (expires in 30 days)
      Cookies.set('token', data.token, { expires: 30 });
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // Register handler
  const register = async ({ fullName, email, mobileNumber, password, referralCode }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, email, mobileNumber, password, referralCode })
      });

      const data = await response.json();
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
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
