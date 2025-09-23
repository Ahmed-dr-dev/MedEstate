import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { BuyerBottomNav } from '../../../components/Buyer/BuyerBottomNav';

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
  const [stats] = useState<DashboardStats>({
    savedProperties: 12,
    loanApplications: 3,
    scheduledVisits: 2,
  });

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

  const renderStatCard = (title: string, value: number, icon: string, color: string, description: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statDescription}>{description}</Text>
    </View>
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
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.userName}>{user?.display_name || 'Buyer'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Overview */}
        <View style={styles.marketSection}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <View style={styles.trendsContainer}>
            {marketTrends.map(renderMarketTrend)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/BrowseProperties')}
            >
              <View style={styles.quickActionIconContainer}>
                <Text style={styles.quickActionIcon}>🔍</Text>
              </View>
              <Text style={styles.quickActionTitle}>Browse</Text>
              <Text style={styles.quickActionSubtitle}>Find properties</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/AddProperty')}
            >
              <View style={styles.quickActionIconContainer}>
                <Text style={styles.quickActionIcon}>🏠</Text>
              </View>
              <Text style={styles.quickActionTitle}>Post Property</Text>
              <Text style={styles.quickActionSubtitle}>List for sale</Text>
            </TouchableOpacity>
            
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
                <Text style={styles.quickActionIcon}>📋</Text>
              </View>
              <Text style={styles.quickActionTitle}>Apply</Text>
              <Text style={styles.quickActionSubtitle}>Submit application</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            {renderStatCard('Saved Properties', stats.savedProperties, '❤️', '#ef4444', 'Properties you\'ve favorited')}
            {renderStatCard('Loan Applications', stats.loanApplications, '💰', '#10b981', 'Applications submitted')}
            {renderStatCard('Scheduled Visits', stats.scheduledVisits, '📅', '#f59e0b', 'Property visits planned')}
          </View>
        </View>
      </ScrollView>

      <BuyerBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 14,
    color: '#64748b',
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
    color: '#1e293b',
  },
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748b',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: '#f8fafc',
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
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});