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

interface BankAgent {
  id: string;
  name: string;
  bankName: string;
  email: string;
  employeeId: string;
  licenseNumber: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export default function BankAgentVerification() {
  const [bankAgents] = useState<BankAgent[]>([
    {
      id: '1',
      name: 'John Smith',
      bankName: 'First National Bank',
      email: 'john.smith@bank.com',
      employeeId: 'EMP001234',
      licenseNumber: 'LIC789456',
      verificationStatus: 'pending',
      submittedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      bankName: 'Metro Bank',
      email: 'sarah.johnson@metro.com',
      employeeId: 'EMP005678',
      licenseNumber: 'LIC123789',
      verificationStatus: 'approved',
      submittedDate: '2024-01-14',
    },
    {
      id: '3',
      name: 'Mike Davis',
      bankName: 'City Bank',
      email: 'mike.davis@citybank.com',
      employeeId: 'EMP009012',
      licenseNumber: 'LIC456123',
      verificationStatus: 'rejected',
      submittedDate: '2024-01-13',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const handleVerificationAction = (agentId: string, action: 'approve' | 'reject') => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this bank agent?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Reject',
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: () => {
            Alert.alert('Success', `Bank agent ${action}d successfully!`);
          }
        }
      ]
    );
  };

  const renderBankAgentCard = (agent: BankAgent) => (
    <View key={agent.id} style={styles.agentCard}>
      <View style={styles.agentHeader}>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{agent.name}</Text>
          <Text style={styles.bankName}>{agent.bankName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agent.verificationStatus) + '20' }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(agent.verificationStatus)}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(agent.verificationStatus) }]}>
            {agent.verificationStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.agentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{agent.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Employee ID:</Text>
          <Text style={styles.detailValue}>{agent.employeeId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>License Number:</Text>
          <Text style={styles.detailValue}>{agent.licenseNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{agent.submittedDate}</Text>
        </View>
      </View>

      {agent.verificationStatus === 'pending' && (
        <View style={styles.agentActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleVerificationAction(agent.id, 'approve')}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleVerificationAction(agent.id, 'reject')}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {(agent.verificationStatus === 'approved' || agent.verificationStatus === 'rejected') && (
        <View style={styles.agentActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => Alert.alert('View Details', 'Agent details would be shown here')}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const pendingCount = bankAgents.filter(agent => agent.verificationStatus === 'pending').length;
  const approvedCount = bankAgents.filter(agent => agent.verificationStatus === 'approved').length;
  const rejectedCount = bankAgents.filter(agent => agent.verificationStatus === 'rejected').length;

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
            <Text style={styles.greeting}>Bank Agent Verification 🔐</Text>
            <Text style={styles.userName}>Admin Dashboard</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Verification Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>⏳</Text>
                </View>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>{pendingCount}</Text>
              </View>
              <Text style={styles.statTitle}>Pending Review</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>✅</Text>
                </View>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{approvedCount}</Text>
              </View>
              <Text style={styles.statTitle}>Approved</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>❌</Text>
                </View>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>{rejectedCount}</Text>
              </View>
              <Text style={styles.statTitle}>Rejected</Text>
            </View>
          </View>
        </View>

        {/* Bank Agents List */}
        <View style={styles.agentsSection}>
          <Text style={styles.sectionTitle}>Bank Agent Applications</Text>
          <View style={styles.agentsList}>
            {bankAgents.map(renderBankAgentCard)}
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
    width: '30%',
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
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  agentsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  agentsList: {
    gap: 16,
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bankName: {
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
  agentDetails: {
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
  agentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
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
