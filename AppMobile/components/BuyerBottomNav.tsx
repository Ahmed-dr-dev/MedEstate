import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { router, usePathname } from 'expo-router';

interface NavItem {
  name: string;
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  { name: 'dashboard', label: 'Home', icon: '🏡', route: '/Screens/Buyer/Dashboard' },
  { name: 'browse', label: 'Browse', icon: '🔍', route: '/Screens/Buyer/BrowseProperties' },
  { name: 'favorites', label: 'Favorites', icon: '❤️', route: '/Screens/Buyer/Favorites' },
  { name: 'loans', label: 'Loans', icon: '💰', route: '/Screens/Buyer/LoanStatus' },
];

export const BuyerBottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route;
  };

  const handleNavPress = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.navItem,
              isActive(item.route) && styles.activeNavItem
            ]}
            onPress={() => handleNavPress(item.route)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.navIcon,
              isActive(item.route) && styles.activeNavIcon
            ]}>
              {item.icon}
            </Text>
            <Text style={[
              styles.navLabel,
              isActive(item.route) && styles.activeNavLabel
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area for iPhone home indicator
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  activeNavItem: {
    backgroundColor: '#eff6ff',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
