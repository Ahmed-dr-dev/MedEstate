import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

interface LoanApplication {
  id: string;
  applicantName: string;
  propertyTitle: string;
  loanAmount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedDate: string;
  creditScore: number;
  annualIncome: number;
  downPayment: number;
  propertyValue: number;
}

interface BankAgentStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export default function BankAgentDashboard() {
  const { user } = useAuth();
  const [stats] = useState<BankAgentStats>({
    totalApplications: 24,
    pendingApplications: 8,
    approvedApplications: 12,
    rejectedApplications: 4,
  });

  const [applications] = useState<LoanApplication[]>([
    {
      id: '1',
      applicantName: 'John Smith',
      propertyTitle: 'Modern Downtown Condo',
      loanAmount: 680000,
      status: 'pending',
      submittedDate: '2024-01-15',
      creditScore: 750,
      annualIncome: 120000,
      downPayment: 150000,
      propertyValue: 850000,
    },
    {
      id: '2',
      applicantName: 'Sarah Johnson',
      propertyTitle: 'Suburban Family Home',
      loanAmount: 450000,
      status: 'under_review',
      submittedDate: '2024-01-14',
      creditScore: 720,
      annualIncome: 95000,
      downPayment: 100000,
      propertyValue: 550000,
    },
    {
      id: '3',
      applicantName: 'Mike Davis',
      propertyTitle: 'Luxury Apartment',
      loanAmount: 320000,
      status: 'approved',
      submittedDate: '2024-01-13',
      creditScore: 780,
      annualIncome: 110000,
      downPayment: 80000,
      propertyValue: 400000,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'under_review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'under_review': return '🔍';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const handleApplicationAction = (applicationId: string, action: 'approve' | 'reject' | 'review') => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Mark as Reviewing',
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: () => {
            Alert.alert('Success', `Application ${action}d successfully!`);
          }
        }
      ]
    );
  };

  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderApplicationCard = (application: LoanApplication) => (
    <View key={application.id} style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicantName}>{application.applicantName}</Text>
          <Text style={styles.propertyTitle}>{application.propertyTitle}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(application.status)}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loan Amount:</Text>
          <Text style={styles.detailValue}>${application.loanAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Credit Score:</Text>
          <Text style={styles.detailValue}>{application.creditScore}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Annual Income:</Text>
          <Text style={styles.detailValue}>${application.annualIncome.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{application.submittedDate}</Text>
        </View>
      </View>

      {application.status === 'pending' && (
        <View style={styles.applicationActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.reviewButton]}
            onPress={() => handleApplicationAction(application.id, 'review')}
          >
            <Text style={styles.reviewButtonText}>Start Review</Text>
          </TouchableOpacity>
        </View>
      )}

      {application.status === 'under_review' && (
        <View style={styles.applicationActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApplicationAction(application.id, 'approve')}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleApplicationAction(application.id, 'reject')}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {(application.status === 'approved' || application.status === 'rejected') && (
        <View style={styles.applicationActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => Alert.alert('View Details', 'Application details would be shown here')}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
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
            <Text style={styles.userName}>{user?.display_name || 'Bank Agent'}</Text>
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationIcon}>✅</Text>
              <Text style={styles.verificationText}>Verified Bank Agent</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Application Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Applications', stats.totalApplications, '📋', '#3b82f6')}
            {renderStatCard('Pending Review', stats.pendingApplications, '⏳', '#f59e0b')}
            {renderStatCard('Approved', stats.approvedApplications, '✅', '#10b981')}
            {renderStatCard('Rejected', stats.rejectedApplications, '❌', '#ef4444')}
          </View>
        </View>

        {/* Recent Applications */}
        <View style={styles.applicationsSection}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          <View style={styles.applicationsList}>
            {applications.map(renderApplicationCard)}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
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
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verificationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  verificationText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '48%',
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
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  applicationsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  applicationsList: {
    gap: 16,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  applicationInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButton: {
    backgroundColor: '#3b82f6',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
