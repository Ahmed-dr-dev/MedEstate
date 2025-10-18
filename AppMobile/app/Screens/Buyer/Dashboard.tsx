import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL } from '@/constants/api';

const { width } = Dimensions.get('window');

interface DashboardStats {
  savedProperties: number;
  loanApplications: number;
  scheduledVisits: number;
}

interface MarketTrend {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { width, height } = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  
  const [stats, setStats] = useState<DashboardStats>({
    savedProperties: 0,
    loanApplications: 0,
    scheduledVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
    
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
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch saved properties count
      const favoritesResponse = await fetch(`${API_BASE_URL}/properties/save?user_id=${user.id}`);
      const favoritesResult = await favoritesResponse.json();
      
      // Fetch loan applications count
      const applicationsResponse = await fetch(`${API_BASE_URL}/loan-applications?applicant_id=${user.id}`);
      const applicationsResult = await applicationsResponse.json();
      
      setStats({
        savedProperties: favoritesResult.success && favoritesResult.data ? favoritesResult.data.length : 0,
        loanApplications: applicationsResult.success && applicationsResult.applications ? applicationsResult.applications.length : 0,
        scheduledVisits: 0, // This can be implemented later if needed
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [marketTrends] = useState<MarketTrend[]>([
    {
      id: '1',
      title: 'Average Home Price',
      value: '$485,000',
      change: '+2.3%',
      trend: 'up'
    },
    {
      id: '2',
      title: 'Interest Rate',
      value: '6.2%',
      change: '-0.1%',
      trend: 'down'
    },
    {
      id: '3',
      title: 'Market Activity',
      value: 'High',
      change: '+15%',
      trend: 'up'
    },
  ]);

  const renderStatCard = (title: string, value: number, icon: string, color: string, description: string, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderMarketTrend = (trend: MarketTrend) => (
    <View key={trend.id} style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>{trend.title}</Text>
        <View style={[styles.trendIndicator, { backgroundColor: trend.trend === 'up' ? '#dcfce7' : '#fef2f2' }]}>
          <Text style={[styles.trendChange, { color: trend.trend === 'up' ? '#16a34a' : '#dc2626' }]}>
            {trend.trend === 'up' ? '↗' : '↘'} {trend.change}
          </Text>
        </View>
      </View>
      <Text style={styles.trendValue}>{trend.value}</Text>
    </View>
  );

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
            <View style={styles.buyerIconContainer}>
              <Text style={styles.buyerIcon}>🏠</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.userName}>Welcome back! {user?.display_name || 'Buyer'}</Text>
              <Text style={styles.subtitle}>Find your dream home</Text>
            </View>
          </View>
        </Animated.View>


        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActionsSection,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/LoanSimulator')}
            >
              <View style={styles.quickActionIconContainer}>
                <Text style={styles.quickActionIcon}>🧮</Text>
              </View>
              <Text style={styles.quickActionTitle}>Simulator</Text>
              <Text style={styles.quickActionSubtitle}>Calculate loans</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/LoanApplication')}
            >
              <View style={styles.quickActionIconContainer}>
                <Text style={styles.quickActionIcon}>💰</Text>
              </View>
              <Text style={styles.quickActionTitle}>Apply Loan</Text>
              <Text style={styles.quickActionSubtitle}>Get financing</Text>
            </TouchableOpacity>
          
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            {loading ? (
              <View style={styles.loadingStatsContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingStatsText}>Loading your activity...</Text>
              </View>
            ) : (
              <>
                {renderStatCard('Saved Properties', stats.savedProperties, '❤️', '#ef4444', 'Properties you\'ve favorited')}
                {renderStatCard('Loan Applications', stats.loanApplications, '💰', '#10b981', 'Applications submitted', () => router.push('/Screens/Buyer/LoanApplicationResults'))}
              </>
            )}
          </View>
        </Animated.View>
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
  buyerIconContainer: {
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
  buyerIcon: {
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
  // Market Section
  marketSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  trendsContainer: {
    gap: 12,
  },
  trendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  trendIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 52) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    gap: 16,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  loadingStatsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingStatsText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});