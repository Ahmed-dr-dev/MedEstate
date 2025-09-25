import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import AdminNavigation from './AdminNavigation';
import AdminStatsOverview from './AdminStatsOverview';
import BankAgentVerification from './BankAgentVerification';
import AdminUsers from './AdminUsers';
import { useAuth } from '../../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

type DashboardTab = 'overview' | 'bank-agents' | 'users';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -20,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    };

    setTimeout(() => createFloatingAnimation(floatAnim1, 0).start(), 500);
    setTimeout(() => createFloatingAnimation(floatAnim2, 1000).start(), 1000);
    setTimeout(() => createFloatingAnimation(floatAnim3, 2000).start(), 1500);
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStatsOverview />;
      case 'bank-agents':
        return <BankAgentVerification />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminStatsOverview />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background Elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle1,
          {
            transform: [{ translateY: floatAnim1 }],
            left: width * 0.1,
            top: height * 0.15,
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.square1,
          {
            transform: [{ translateY: floatAnim2 }],
            right: width * 0.15,
            top: height * 0.25,
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle2,
          {
            transform: [{ translateY: floatAnim3 }],
            left: width * 0.7,
            bottom: height * 0.3,
          }
        ]} 
      />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.adminIconContainer}>
              <Text style={styles.adminIcon}>👑</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.userName}>{user?.display_name || 'Admin'}</Text>
              <Text style={styles.subtitle}>Manage your platform</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Navigation */}
        <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <View style={styles.content}>
          {renderActiveComponent()}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  floatingElement: {
    position: 'absolute',
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
  },
  square1: {
    width: 80,
    height: 80,
    backgroundColor: '#8b5cf6',
    transform: [{ rotate: '45deg' }],
  },
  circle2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#06b6d4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  adminIcon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
