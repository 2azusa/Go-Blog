import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { profileApi } from '../api/api';
import type { IRspProfile } from '../api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: IRspProfile | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<IRspProfile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await profileApi.getProfile();
          setUserProfile(response.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch profile, logging out', error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      const response = await profileApi.getProfile();
      setUserProfile(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch profile after login', error);
      // Even if profile fetch fails, user might be technically logged in.
      // Decide on desired behavior. For now, we'll consider them logged in.
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};