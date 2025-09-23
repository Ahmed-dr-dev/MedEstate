import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    router.push(route as any);
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
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 34, // Safe area padding for iOS
    paddingTop: 12,
    paddingHorizontal: 8,
    backdropFilter: 'blur(20px)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeNavItem: {
    // Active state styling handled by individual elements
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  icon: {
    fontSize: 20,
  },
  activeIcon: {
    fontSize: 22,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default BuyerBottomNavigation;
