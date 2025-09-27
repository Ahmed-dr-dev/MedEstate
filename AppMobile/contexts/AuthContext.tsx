import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AppState } from 'react-native';
import { API_BASE_URL } from '@/constants/api';

export type UserRole = 'buyer' | 'seller' | 'bank_agent' | 'admin';

export interface User {
  id: string;
  email: string;
  display_name: string;
  phone?: string;
  role: UserRole;
  registration_completed?: boolean;
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
  clearAllData: () => Promise<void>;
  navigateToRoleHome: () => void;
  validateSession: () => Promise<boolean>;
  updateRegistrationStatus: () => Promise<void>;
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

  // Handle app state changes (when app comes back to foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && user && session) {
        console.log('🔄 AUTH - App became active, validating session');
        validateSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [user, session]);

  const loadStoredUser = async () => {
    try {
      console.log('🔄 AUTH - Loading stored user and session...');
      
      const [storedUser, storedSession] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('session')
      ]);
      
      if (storedUser && storedSession) {
        console.log('📱 AUTH - Found stored user and session');
        
        const userData = JSON.parse(storedUser);
        const sessionData = JSON.parse(storedSession);
        
        console.log('👤 AUTH - User data:', userData.email, userData.role);
        console.log('🔑 AUTH - Session expires at:', new Date(sessionData.expires_at * 1000).toLocaleString());
        
        // Set user and session data first
        setUser(userData);
        setSession(sessionData);
        
        // Check if session is expired
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = sessionData.expires_at - currentTime;
        
        console.log('⏰ AUTH - Time until expiry:', timeUntilExpiry, 'seconds');
        
        if (sessionData.expires_at > currentTime) {
          // Session is still valid
          setIsAuthenticated(true);
          console.log('✅ AUTH - Session is valid, user authenticated');
          
          // User is authenticated, navigation will be handled by the app
          console.log('✅ AUTH - User authenticated, ready for navigation');
        } else {
          // Session expired, clear storage and sign out
          console.log('⚠️ AUTH - Session expired, clearing storage');
          await AsyncStorage.multiRemove(['user', 'session']);
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          console.log('🚪 AUTH - User signed out due to expired session');
        }
      } else {
        console.log('📭 AUTH - No stored user or session found');
      }
    } catch (error) {
      console.error('❌ AUTH - Load error:', error);
      // Clear storage on error
      await AsyncStorage.multiRemove(['user', 'session']);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      console.log('🏁 AUTH - Loading complete, isLoading:', false);
    }
  };

  const redirectToRoleDashboard = (userRole: UserRole, userData?: User) => {
    switch (userRole) {
      case 'buyer':
        router.replace('/Screens/Buyer/Dashboard');
        break;
     
      case 'bank_agent':
        // Check if bank agent has completed registration
        if (userData?.registration_completed) {
          router.replace('/Screens/BankAgent/Dashboard');
        } else {
          router.replace('/Screens/BankAgent/Registration');
        }
        break;
      case 'admin':
        router.replace('/Screens/Admin/AdminDashboard');
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
      console.log('🔍 SIGN IN - Response data:', data);
      
      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          display_name: data.user.display_name || '',
          phone: data.user.phone || '',
          role: data.user.role || 'buyer',
          registration_completed: data.user.registration_completed || false,
        };

        // Extract session data from response
        const sessionData: Session = {
          access_token: data.session?.access_token || data.access_token || '',
          refresh_token: data.session?.refresh_token || data.refresh_token || '',
          expires_at: data.session?.expires_at || data.expires_at || (Date.now() / 1000) + (24 * 60 * 60) // Default 24 hours if not provided
        };

        console.log('👤 SIGN IN - User data:', userData);
        console.log('🔑 SIGN IN - Session data:', sessionData);
        console.log('⏰ SIGN IN - Session expires at:', new Date(sessionData.expires_at * 1000).toLocaleString());

         // Store user and session data
         await Promise.all([
           AsyncStorage.setItem('user', JSON.stringify(userData)),
           AsyncStorage.setItem('session', JSON.stringify(sessionData))
         ]);
         
         // Update state
         setUser(userData);
         setSession(sessionData);
         setIsAuthenticated(true);
        
        console.log('✅ SIGN IN - Success:', userData.role);
        
        // User signed in successfully, navigation will be handled by the app
        console.log('✅ SIGN IN - User signed in, ready for navigation');
        
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

  const clearAllData = async () => {
    try {
      console.log('🧹 CLEAR ALL DATA - Starting data cleanup...');
      
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log('📋 CLEAR ALL DATA - Found keys:', keys);
      
      if (keys && keys.length > 0) {
        // Remove all stored data
        await AsyncStorage.multiRemove(keys);
        console.log('🗑️ CLEAR ALL DATA - Removed all stored data');
      }
      
      console.log('✅ CLEAR ALL DATA - Data cleanup completed');
    } catch (error) {
      console.error('❌ CLEAR ALL DATA - Error during cleanup:', error);
      
      // Fallback: try to clear specific keys
      try {
        await AsyncStorage.multiRemove(['user', 'session', 'token', 'auth', 'profile']);
        console.log('🔄 CLEAR ALL DATA - Fallback cleanup completed');
      } catch (fallbackError) {
        console.error('❌ CLEAR ALL DATA - Fallback cleanup failed:', fallbackError);
      }
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 SIGN OUT - Starting logout process...');
      
      // Clear all app data
      await clearAllData();
      
      // Reset all state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log('🔄 SIGN OUT - Reset all state');
      
      // Navigate to landing page
      router.replace('/');
      console.log('🏠 SIGN OUT - Redirected to landing page');
      
      console.log('✅ SIGN OUT - Logout completed successfully');
    } catch (error) {
      console.error('❌ SIGN OUT - Error during logout:', error);
      
      // Force reset state even if storage clearing fails
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Still navigate to landing page
      router.replace('/');
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      // First check if we have session and user in state
      if (!session || !user) {
        console.log('⚠️ AUTH - No session/user in state, checking storage');
        
        // Try to load from storage
        const [storedUser, storedSession] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('session')
        ]);
        
        if (!storedUser || !storedSession) {
          console.log('❌ AUTH - No stored session found');
          return false;
        }
        
        const userData = JSON.parse(storedUser);
        const sessionData = JSON.parse(storedSession);
        
        // Update state with stored data
        setUser(userData);
        setSession(sessionData);
        
        // Use the loaded session for validation
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (sessionData.expires_at <= currentTime) {
          console.log('⚠️ AUTH - Stored session expired, signing out');
          await signOut();
          return false;
        }
        
        console.log('✅ AUTH - Stored session is valid');
        return true;
      }

      // We have session in state, validate it
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (session.expires_at <= currentTime) {
        console.log('⚠️ AUTH - Session expired, signing out');
        await signOut();
        return false;
      }

      // Session is still valid
      console.log('✅ AUTH - Session is valid');
      return true;
    } catch (error) {
      console.error('❌ AUTH - Session validation error:', error);
      await signOut();
      return false;
    }
  };


  const navigateToRoleHome = () => {
    if (user) {
      redirectToRoleDashboard(user.role, user);
    }
  };

  const updateRegistrationStatus = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 AUTH - Updating registration status for user:', user.id);
      
      // Update user state
      const updatedUser = { ...user, registration_completed: true };
      setUser(updatedUser);
      
      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('✅ AUTH - Registration status updated successfully');
    } catch (error) {
      console.error('❌ AUTH - Error updating registration status:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    clearAllData,
    navigateToRoleHome,
    validateSession,
    updateRegistrationStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};