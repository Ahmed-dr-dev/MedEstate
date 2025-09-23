import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

export type UserRole = 'buyer' | 'seller' | 'bank_agent' | 'admin';

export interface User {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  role: UserRole;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  navigateToRoleHome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const [storedUser, storedSession] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('session')
      ]);
      
      if (storedUser && storedSession) {
        const userData = JSON.parse(storedUser);
        const sessionData = JSON.parse(storedSession);
        
        // Check if session is still valid
        const currentTime = Math.floor(Date.now() / 1000);
        if (sessionData.expires_at > currentTime) {
          setUser(userData);
          setSession(sessionData);
          setIsAuthenticated(true);
          console.log('✅ AUTH - User loaded:', userData.role);
        } else {
          // Session expired, clear storage
          await AsyncStorage.multiRemove(['user', 'session']);
          console.log('⚠️ AUTH - Session expired');
        }
      }
    } catch (error) {
      console.error('❌ AUTH - Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRoleDashboard = (userRole: UserRole) => {
    switch (userRole) {
      case 'buyer':
        router.replace('/Screens/Buyer/Dashboard');
        break;
      case 'seller':
        // Seller dashboard doesn't exist yet, redirect to home for now
        router.replace('/Screens/home');
        break;
      case 'bank_agent':
        router.replace('/Screens/BankAgent/LoanReviewDashboard');
        break;
      case 'admin':
        router.replace('/Screens/home');
        break;
      default:
        router.replace('/Screens/Buyer/Dashboard');
        break;
    }
    console.log(`🧭 REDIRECT - ${userRole} dashboard`);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/Signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          display_name: data.user.display_name || '',
          phone: data.user.phone || '',
          role: data.user.role || 'buyer',
        };

         // Store user and session data
         await Promise.all([
           AsyncStorage.setItem('user', JSON.stringify(userData)),
           AsyncStorage.setItem('session', JSON.stringify(data.session))
         ]);
         
         // Update state
         setUser(userData);
         setSession(data.session);
         setIsAuthenticated(true);
        
        console.log('✅ SIGN IN - Success:', userData.role);
        
        // Auto-redirect to role dashboard
        redirectToRoleDashboard(userData.role);
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Sign in failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear storage
      await AsyncStorage.multiRemove(['user', 'session']);
      
      // Reset state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Navigate to landing page
      router.replace('/');
      
      console.log('✅ SIGN OUT - Complete');
    } catch (error) {
      console.error('❌ SIGN OUT - Error:', error);
    }
  };

  const navigateToRoleHome = () => {
    if (user) {
      redirectToRoleDashboard(user.role);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    navigateToRoleHome,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};