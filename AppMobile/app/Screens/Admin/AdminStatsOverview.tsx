import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { API_BASE_URL } from '../../../constants/api';

interface AdminStats {
  totalUsers: number;
  totalBankAgentRegistrations: number;
  totalProperties: number;
  totalLoanApplications: number;
  bankAgentStatusCounts: {
    pending: number;
    approved: number;
    rejected: number;
  };
  loanApplicationStatusCounts: {
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
  };
  recentActivity: {
    users: number;
    properties: number;
    loanApplications: number;
    bankAgentRequests: number;
  };
  bankAgentMetrics: {
    top_performers: Array<{
      agent_name: string;
      bank_name: string;
      total_applications: number;
      approved: number;
      rejected: number;
      pending: number;
      approval_rate: string;
    }>;
    total_agents_with_applications: number;
  };
}

export default function AdminStatsOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      Alert.alert('Error', 'Failed to fetch statistics. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load statistics</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            color="#3b82f6"
            subtitle={`+${stats.recentActivity.users} this week`}
          />
          <StatCard
            title="Total Properties"
            value={stats.totalProperties.toLocaleString()}
            icon="🏠"
            color="#f59e0b"
            subtitle={`+${stats.recentActivity.properties} this week`}
          />
          <StatCard
            title="Loan Applications"
            value={stats.totalLoanApplications.toLocaleString()}
            icon="💰"
            color="#10b981"
            subtitle={`+${stats.recentActivity.loanApplications} this week`}
          />
          <StatCard
            title="Bank Agent Requests"
            value={stats.totalBankAgentRegistrations.toLocaleString()}
            icon="🏦"
            color="#8b5cf6"
            subtitle={`+${stats.recentActivity.bankAgentRequests} this week`}
          />
        </View>
      </View>

      {/* Bank Agent Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Agent Status</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Pending"
            value={stats.bankAgentStatusCounts.pending}
            icon="⏳"
            color="#f59e0b"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Approved"
            value={stats.bankAgentStatusCounts.approved}
            icon="✅"
            color="#10b981"
            subtitle="Active agents"
          />
          <StatCard
            title="Rejected"
            value={stats.bankAgentStatusCounts.rejected}
            icon="❌"
            color="#ef4444"
            subtitle="Declined applications"
          />
        </View>
      </View>

      {/* Loan Application Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loan Application Status</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Pending"
            value={stats.loanApplicationStatusCounts.pending}
            icon="⏳"
            color="#f59e0b"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Under Review"
            value={stats.loanApplicationStatusCounts.under_review}
            icon="🔍"
            color="#3b82f6"
            subtitle="Being processed"
          />
          <StatCard
            title="Approved"
            value={stats.loanApplicationStatusCounts.approved}
            icon="✅"
            color="#10b981"
            subtitle="Successful loans"
          />
          <StatCard
            title="Rejected"
            value={stats.loanApplicationStatusCounts.rejected}
            icon="❌"
            color="#ef4444"
            subtitle="Declined applications"
          />
        </View>
      </View>

      {/* Bank Agent Performance */}
      {stats.bankAgentMetrics && stats.bankAgentMetrics.top_performers && stats.bankAgentMetrics.top_performers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Bank Agents</Text>
          <View style={styles.statsGrid}>
            {stats.bankAgentMetrics.top_performers.slice(0, 3).map((agent, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                <View style={styles.statHeader}>
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>🏆</Text>
                  </View>
                  <Text style={[styles.statValue, { color: '#10b981' }]}>
                    {agent.approval_rate}%
                  </Text>
                </View>
                <Text style={styles.statTitle}>{agent.agent_name}</Text>
                <Text style={styles.statSubtitle}>
                  {agent.bank_name} • {agent.total_applications} applications
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});

