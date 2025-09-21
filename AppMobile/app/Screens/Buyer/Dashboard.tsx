import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { BuyerBottomNav } from '../../../components/BuyerBottomNav';

const { width } = Dimensions.get('window');

interface DashboardStats {
  savedProperties: number;
  viewedProperties: number;
  loanApplications: number;
  scheduledVisits: number;
}

interface RecentActivity {
  id: string;
  type: 'view' | 'favorite' | 'loan' | 'visit';
  title: string;
  subtitle: string;
  time: string;
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    savedProperties: 12,
    viewedProperties: 45,
    loanApplications: 3,
    scheduledVisits: 2,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'favorite',
      title: 'Modern Medical Office',
      subtitle: 'Added to favorites',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'loan',
      title: 'Loan Application Submitted',
      subtitle: 'Downtown Medical Center',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'visit',
      title: 'Property Visit Scheduled',
      subtitle: 'Medical Plaza Building',
      time: '2 days ago'
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return '👀';
      case 'favorite': return '❤️';
      case 'loan': return '💰';
      case 'visit': return '📅';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return '#64748b';
      case 'favorite': return '#ef4444';
      case 'loan': return '#10b981';
      case 'visit': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderActivity = ({ item }: { item: RecentActivity }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) + '20' }]}>
        <Text style={styles.activityIconText}>{getActivityIcon(item.type)}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.activityTime}>{item.time}</Text>
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
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/BrowseProperties')}
            >
              <Text style={styles.quickActionIcon}>🏠</Text>
              <Text style={styles.quickActionTitle}>Browse</Text>
              <Text style={styles.quickActionSubtitle}>Find properties</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/Favorites')}
            >
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionTitle}>Favorites</Text>
              <Text style={styles.quickActionSubtitle}>Saved properties</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/Screens/Buyer/LoanApplication')}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionTitle}>Loans</Text>
              <Text style={styles.quickActionSubtitle}>Track applications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>📞</Text>
              <Text style={styles.quickActionTitle}>Support</Text>
              <Text style={styles.quickActionSubtitle}>Get help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Saved Properties', stats.savedProperties, '❤️', '#ef4444')}
            {renderStatCard('Properties Viewed', stats.viewedProperties, '👀', '#2563eb')}
            {renderStatCard('Loan Applications', stats.loanApplications, '💰', '#10b981')}
            {renderStatCard('Scheduled Visits', stats.scheduledVisits, '📅', '#f59e0b')}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivity.map((item) => (
              <View key={item.id}>
                {renderActivity({ item })}
              </View>
            ))}
          </View>
        </View>

        {/* Featured Properties */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push('/Screens/Buyer/BrowseProperties')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.comingSoonText}>Featured properties coming soon...</Text>
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
    paddingBottom: 100, // Space for bottom navigation
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
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 4,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  featuredSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 40,
    fontStyle: 'italic',
  },
});
