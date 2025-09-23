import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
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
          name="Screens/Buyer/Dashboard" 
          options={{ title: 'Buyer Dashboard' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/BrowseProperties" 
          options={{ title: 'Browse Properties' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/PropertyDetails" 
          options={{ title: 'Property Details' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/Favorites" 
          options={{ title: 'Favorites' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/Profile" 
          options={{ title: 'Buyer Profile' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/LoanApplication" 
          options={{ title: 'Loan Application' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/LoanStatus" 
          options={{ title: 'Loan Status' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/LoanApplicationResults" 
          options={{ title: 'Loan Application Results' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/LoanSimulator" 
          options={{ title: 'Loan Simulator' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/NewLoanApplication" 
          options={{ title: 'New Loan Application' }}
        />
        <Stack.Screen 
          name="Screens/Buyer/AddProperty" 
          options={{ title: 'Add Property' }}
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
          name="Screens/BankAgent/Registration" 
          options={{ title: 'Bank Agent Registration' }}
        />
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