import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminStatsOverview() {
  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1247,
    totalLoanRequests: 89,
    pendingBankAgents: 12,
    approvedBankAgents: 45,
    totalProperties: 234,
    activeLoans: 67,
    completedLoans: 22,
    monthlyRevenue: 125000,
  };

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            color="#3b82f6"
            subtitle="+12% this month"
          />
          <StatCard
            title="Loan Requests"
            value={stats.totalLoanRequests}
            icon="💰"
            color="#10b981"
            subtitle="+8 pending"
          />
          <StatCard
            title="Properties"
            value={stats.totalProperties}
            icon="🏠"
            color="#f59e0b"
            subtitle="Available"
          />
          <StatCard
            title="Active Loans"
            value={stats.activeLoans}
            icon="📋"
            color="#8b5cf6"
            subtitle="In progress"
          />
        </View>
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    flex: 1,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
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
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
 
  
});
