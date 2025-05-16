import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevChildren, setPrevChildren] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      setIsAuthenticated(!!token);
    };

    checkToken();

    // Listen for auth changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'token' || !e.key) {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Store previous children when transitioning
  useEffect(() => {
    if (isTransitioning) {
      setPrevChildren(children);
    } else {
      setPrevChildren(null);
    }
  }, [isTransitioning, children]);

  const login = useCallback(async (token) => {
    try {
      setIsTransitioning(true);
      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsAuthenticated(true);
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsTransitioning(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsTransitioning(true);
      localStorage.removeItem('token');
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      setAuthToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsTransitioning(false);
    }
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    setIsAuthenticated(!!token);
    return !!token;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isTransitioning,
      login, 
      logout,
      checkAuthStatus,
      token: authToken
    }}>
      <div className="relative">
        {/* Previous content layer */}
        {prevChildren && (
          <div className="absolute inset-0 w-full">
            {prevChildren}
          </div>
        )}
        {/* Current content layer */}
        <div className={`relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
