import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions
} from "react-native";
import { API_BASE_URL } from '@/constants/api';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState('Ready to test');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/TestConnection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setConnectionStatus('✅ Connection successful!');
    } catch (error) {
      console.error(error);
      setConnectionStatus('❌ Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    router.replace('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'properties':
        return renderProperties();
      case 'analytics':
        return renderAnalytics();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Dashboard</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Visits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Offers</Text>
        </View>
      </View>
      
      <View style={styles.systemCard}>
        <Text style={styles.cardTitle}>System Status</Text>
        <Text style={styles.statusText}>{connectionStatus}</Text>
        <TouchableOpacity 
          style={[styles.testButton, isLoading && styles.disabledButton]}
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.testButtonText}>
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProperties = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Properties</Text>
      <View style={styles.propertyList}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.propertyCard}>
            <View style={styles.propertyImage}>
              <Text style={styles.propertyEmoji}>🏥</Text>
            </View>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>Medical Center {item}</Text>
              <Text style={styles.propertyLocation}>Downtown District</Text>
              <Text style={styles.propertyPrice}>$2,500,000</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Analytics</Text>
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Market Trends</Text>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Medical Properties</Text>
          <Text style={styles.trendValue}>+12%</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Average Price</Text>
          <Text style={styles.trendValue}>$1.8M</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Time on Market</Text>
          <Text style={styles.trendValue}>45 days</Text>
        </View>
      </View>
    </View>
  );

  const renderProfile = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>U</Text>
        </View>
        <Text style={styles.profileName}>User Profile</Text>
        <Text style={styles.profileEmail}>user@medestate.com</Text>
        
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption} onPress={handleSignOut}>
          <Text style={[styles.profileOptionText, styles.signOutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>M</Text>
            </View>
            <Text style={styles.brandName}>MedEstate</Text>
          </View>
          <View style={styles.headerDecor} />
        </View>

        {/* Tab Content */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderTabContent()}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={[styles.navItem, activeTab === 'dashboard' && styles.activeNavItem]}
              onPress={() => setActiveTab('dashboard')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconContainer, activeTab === 'dashboard' && styles.activeNavIconContainer]}>
                <Text style={[styles.navIcon, activeTab === 'dashboard' && styles.activeNavIcon]}>📊</Text>
              </View>
              <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.activeNavLabel]}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navItem, activeTab === 'properties' && styles.activeNavItem]}
              onPress={() => setActiveTab('properties')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconContainer, activeTab === 'properties' && styles.activeNavIconContainer]}>
                <Text style={[styles.navIcon, activeTab === 'properties' && styles.activeNavIcon]}>🏥</Text>
              </View>
              <Text style={[styles.navLabel, activeTab === 'properties' && styles.activeNavLabel]}>Properties</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navItem, activeTab === 'analytics' && styles.activeNavItem]}
              onPress={() => setActiveTab('analytics')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconContainer, activeTab === 'analytics' && styles.activeNavIconContainer]}>
                <Text style={[styles.navIcon, activeTab === 'analytics' && styles.activeNavIcon]}>📈</Text>
              </View>
              <Text style={[styles.navLabel, activeTab === 'analytics' && styles.activeNavLabel]}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
              onPress={() => setActiveTab('profile')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconContainer, activeTab === 'profile' && styles.activeNavIconContainer]}>
                <Text style={[styles.navIcon, activeTab === 'profile' && styles.activeNavIcon]}>👤</Text>
              </View>
              <Text style={[styles.navLabel, activeTab === 'profile' && styles.activeNavLabel]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.05,
  },
  safeArea: {
    flex: 1,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Extra space for bottom nav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#667eea',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a202c',
    letterSpacing: -0.8,
  },
  headerDecor: {
    width: 4,
    height: 32,
    backgroundColor: '#667eea',
    borderRadius: 2,
    opacity: 0.6,
  },
  
  // Tab Content
  tabContent: {
    paddingVertical: 16,
  },
  tabTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 32,
    letterSpacing: -1,
  },
  
  // Dashboard
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: (width - 72) / 2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  systemCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  statusText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    lineHeight: 24,
  },
  testButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  // Properties
  propertyList: {
    marginTop: 10,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  propertyImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  propertyEmoji: {
    fontSize: 24,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  
  // Analytics
  analyticsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  trendLabel: {
    fontSize: 16,
    color: '#475569',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  
  // Profile
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#667eea',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  profileOption: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileOptionText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  signOutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  
  // Bottom Navigation
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34, // Safe area for home indicator
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 126, 234, 0.1)',
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeNavIconContainer: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navIcon: {
    fontSize: 18,
  },
  activeNavIcon: {
    fontSize: 18,
  },
  navLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeNavLabel: {
    color: '#667eea',
    fontWeight: '700',
  },
});
