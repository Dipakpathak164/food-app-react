import { createContext, useContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode'; // Add this import to decode JWT

const AuthContext = createContext();

const isValidToken = (token) => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;  // Check if token is expired
  } catch (error) {
    console.error('❌ Invalid token:', error);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    if (token && userInfo) {
      if (!isValidToken(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(userInfo);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));  // userData should have primaryAddress
    setIsLoggedIn(true);
    setUser(userData);  // This should include primaryAddress in userData
  };

  const logout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsLoggingOut(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
