import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="Screens/signin" 
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Screens/signup" 
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="Screens/forgot-password" 
          options={{ title: 'Forgot Password' }}
        />
        <Stack.Screen 
          name="Screens/home" 
          options={{ title: 'Home' }}
        />
        
        {/* Buyer Screens */}
        <Stack.Screen 
          name="Screens/Buyer" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Screens/PropertyDetails" 
          options={{ headerShown: false }}
        />
        
        {/* Seller Screens */}
        <Stack.Screen 
          name="Screens/Seller/Dashboard" 
          options={{ title: 'Seller Dashboard' }}
        />
        <Stack.Screen 
          name="Screens/Seller/AddProperty" 
          options={{ title: 'Add Property' }}
        />
        <Stack.Screen 
          name="Screens/Seller/EditProperty" 
          options={{ title: 'Edit Property' }}
        />
        
        {/* Bank Agent Screens */}
        <Stack.Screen 
          name="Screens/BankAgent/Dashboard" 
          options={{ title: 'Bank Agent Dashboard' }}
        />
        <Stack.Screen 
          name="Screens/BankAgent/LoanReviewDashboard" 
          options={{ title: 'Loan Review Dashboard' }}
        />
        <Stack.Screen 
          name="Screens/BankAgent/LoanDetails" 
          options={{ title: 'Loan Details' }}
        />
        <Stack.Screen 
          name="Screens/BankAgent/Profile" 
          options={{ title: 'Bank Agent Profile' }}
        />
      </Stack>
    </AuthProvider>
  );
}