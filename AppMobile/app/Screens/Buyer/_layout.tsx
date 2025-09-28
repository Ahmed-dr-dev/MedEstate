import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import BuyerBottomNavigation from '../../../components/Buyer/BottomNavigation';

export default function BuyerLayout() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  
  // Define navigation order for directional animations
  const navigationOrder = [
    '/Screens/Buyer/Dashboard',
    '/Screens/Buyer/BrowseProperties', 
    '/Screens/Buyer/Favorites',
    '/Screens/Buyer/LoanApplication',
    '/Screens/Buyer/Profile'
  ];
  
  const getAnimationDirection = () => {
    const currentIndex = navigationOrder.indexOf(pathname);
    const previousIndex = navigationOrder.indexOf(previousPathname.current);
        
    if (currentIndex === -1 || previousIndex === -1) {
      return 'slide_from_right';
    }
    
    // Update previous pathname for next navigation
    previousPathname.current = pathname;
      
    // Determine direction based on navigation order
    return currentIndex > previousIndex ? 'slide_from_right' : 'slide_from_left';
  };

  // Hide bottom navigation for PropertyDetails, LoanSimulator, AddProperty, EditProperty, and MyProperties screens
  const shouldShowBottomNav = !pathname.includes('PropertyDetails') && 
                              !pathname.includes('LoanSimulator') && 
                              !pathname.includes('AddProperty') &&
                              !pathname.includes('EditProperty') &&
                              !pathname.includes('MyProperties') &&
                              !pathname.includes('NewLoanApplication') &&
                              !pathname.includes('LoanApplicationResults');



  return (
    <View style={styles.container}>
      
      <Stack 
        screenOptions={{  
          headerShown: false,
          animation: getAnimationDirection(),
          animationDuration: 50,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="Dashboard" />
        <Stack.Screen name="BrowseProperties" />
        <Stack.Screen 
          name="PropertyDetails" 
          options={{ 
            headerShown: false, 
            presentation: 'transparentModal',
            animation: 'fade',
            gestureEnabled: true,
            gestureDirection: 'vertical',
            statusBarStyle: 'light',
            statusBarBackgroundColor: 'transparent',
            statusBarTranslucent: true
          }}
        />
        <Stack.Screen name="Favorites" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="LoanApplication" />
        <Stack.Screen name="LoanStatus" />
        <Stack.Screen name="LoanApplicationResults" />
        <Stack.Screen name="LoanSimulator" />
        <Stack.Screen name="NewLoanApplication" />
        <Stack.Screen name="AddProperty" />
        <Stack.Screen name="MyProperties" />
        <Stack.Screen name="EditProperty" />
      </Stack>
      {shouldShowBottomNav && <BuyerBottomNavigation />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
});
