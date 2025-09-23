import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const BuyerBottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: '🏠', 
      route: '/Screens/Buyer/Dashboard',
      label: 'Home'
    },
    { 
      name: 'Browse', 
      icon: '🔍', 
      route: '/Screens/Buyer/BrowseProperties',
      label: 'Browse'
    },
    { 
      name: 'Favorites', 
      icon: '❤️', 
      route: '/Screens/Buyer/Favorites',
      label: 'Saved'
    },
    { 
      name: 'Loans', 
      icon: '💰', 
      route: '/Screens/Buyer/LoanApplication',
      label: 'Loans'
    },
    { 
      name: 'Profile',  
      icon: '👤', 
      route: '/Screens/Buyer/Profile',
      label: 'Profile'
    },
  ];

  const handleNavigation = (route: string) => {
    router.replace(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.9}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Text style={[styles.icon, isActive && styles.activeIcon]}>
                  {item.icon}
                </Text>
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 41, 72, 0.95)',
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24, 
    paddingBottom: 5, // Safe area padding for iOS
    paddingTop: 2,  
    paddingHorizontal: 8,
    marginHorizontal: 0,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,

  },
  activeNavItem: {
    // Active state styling handled by individual elements
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.6)',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    fontSize: 22,
  },
  activeIcon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  activeLabel: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default BuyerBottomNavigation;
