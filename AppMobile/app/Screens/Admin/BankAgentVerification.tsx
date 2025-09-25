import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
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
  phone?: string;
  experience?: string;
  department?: string;
  managerName?: string;
  documents?: {
    idCard: string;
    license: string;
    employmentLetter: string;
    bankStatement: string;
  };
}

export default function BankAgentVerification() {
  const [selectedAgent, setSelectedAgent] = useState<BankAgent | null>(null);
  const [showModal, setShowModal] = useState(false);
  
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
      phone: '+1 (555) 123-4567',
      experience: '5 years',
      department: 'Commercial Lending',
      managerName: 'Robert Wilson',
      documents: {
        idCard: 'ID_CARD_001.pdf',
        license: 'BANKING_LICENSE_001.pdf',
        employmentLetter: 'EMPLOYMENT_LETTER_001.pdf',
        bankStatement: 'BANK_STATEMENT_001.pdf',
      },
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
      phone: '+1 (555) 234-5678',
      experience: '8 years',
      department: 'Residential Lending',
      managerName: 'Lisa Anderson',
      documents: {
        idCard: 'ID_CARD_002.pdf',
        license: 'BANKING_LICENSE_002.pdf',
        employmentLetter: 'EMPLOYMENT_LETTER_002.pdf',
        bankStatement: 'BANK_STATEMENT_002.pdf',
      },
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
      phone: '+1 (555) 345-6789',
      experience: '3 years',
      department: 'Small Business Lending',
      managerName: 'David Lee',
      documents: {
        idCard: 'ID_CARD_003.pdf',
        license: 'BANKING_LICENSE_003.pdf',
        employmentLetter: 'EMPLOYMENT_LETTER_003.pdf',
        bankStatement: 'BANK_STATEMENT_003.pdf',
      },
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

  const openAgentModal = (agent: BankAgent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAgent(null);
  };

  const handleModalAction = (action: 'approve' | 'reject') => {
    if (!selectedAgent) return;
    
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} ${selectedAgent.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Reject',
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: () => {
            Alert.alert('Success', `Bank agent ${action}d successfully!`);
            closeModal();
          }
        }
      ]
    );
  };

  const renderBankAgentCard = (agent: BankAgent) => (
    <TouchableOpacity 
      key={agent.id} 
      style={styles.agentCard}
      onPress={() => openAgentModal(agent)}
      activeOpacity={0.8}
    >
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
      
      <View style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  const pendingCount = bankAgents.filter(agent => agent.verificationStatus === 'pending').length;
  const approvedCount = bankAgents.filter(agent => agent.verificationStatus === 'approved').length;
  const rejectedCount = bankAgents.filter(agent => agent.verificationStatus === 'rejected').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bank Agent Verification 🔐</Text>
        <Text style={styles.userName}>Manage bank agent applications</Text>
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

      {/* Bank Agent Details Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.fullScreenModal}>
            {selectedAgent && (
              <>
                {/* Modal Header */}
                <View style={styles.fullScreenHeader}>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={closeModal}>
                      <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.fullScreenTitle}>Bank Agent Details</Text>
                  </View>
                  <View style={styles.headerRight}>
                    <View style={[styles.fullScreenStatusBadge, { backgroundColor: getStatusColor(selectedAgent.verificationStatus) + '20' }]}>
                      <Text style={styles.fullScreenStatusIcon}>{getStatusIcon(selectedAgent.verificationStatus)}</Text>
                      <Text style={[styles.fullScreenStatusText, { color: getStatusColor(selectedAgent.verificationStatus) }]}>
                        {selectedAgent.verificationStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Modal Content */}
                <ScrollView style={styles.fullScreenContent} showsVerticalScrollIndicator={false}>
                  {/* Personal Information */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Personal Information</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Name:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.name}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Email:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.email}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Phone:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.phone || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Bank Information */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Bank Information</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Bank Name:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.bankName}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Employee ID:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.employeeId}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Department:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.department || 'N/A'}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Manager:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.managerName || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Professional Information */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Professional Information</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>License Number:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.licenseNumber}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Experience:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.experience || 'N/A'}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Submitted Date:</Text>
                      <Text style={styles.modalDetailValue}>{selectedAgent.submittedDate}</Text>
                    </View>
                  </View>

                  {/* Documents Section */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Submitted Documents</Text>
                    <View style={styles.documentsGrid}>
                      <TouchableOpacity style={styles.documentCard}>
                        <Text style={styles.documentIcon}>🆔</Text>
                        <Text style={styles.documentName}>ID Card</Text>
                        <Text style={styles.documentFile}>{selectedAgent.documents?.idCard}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.documentCard}>
                        <Text style={styles.documentIcon}>📜</Text>
                        <Text style={styles.documentName}>Banking License</Text>
                        <Text style={styles.documentFile}>{selectedAgent.documents?.license}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.documentCard}>
                        <Text style={styles.documentIcon}>📄</Text>
                        <Text style={styles.documentName}>Employment Letter</Text>
                        <Text style={styles.documentFile}>{selectedAgent.documents?.employmentLetter}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.documentCard}>
                        <Text style={styles.documentIcon}>🏦</Text>
                        <Text style={styles.documentName}>Bank Statement</Text>
                        <Text style={styles.documentFile}>{selectedAgent.documents?.bankStatement}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Actions */}
                <View style={styles.fullScreenActions}>
                  {selectedAgent.verificationStatus === 'pending' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.fullScreenActionButton, styles.fullScreenApproveButton]}
                        onPress={() => handleModalAction('approve')}
                      >
                        <Text style={styles.fullScreenApproveButtonText}>Approve Agent</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.fullScreenActionButton, styles.fullScreenRejectButton]}
                        onPress={() => handleModalAction('reject')}
                      >
                        <Text style={styles.fullScreenRejectButtonText}>Reject Agent</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </>
            )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
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
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '30%',
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  agentsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  agentsList: {
    gap: 16,
  },
  agentCard: {
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
    color: 'white',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  modalStatusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    maxHeight: 400,
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    flex: 1,
  },
  modalDetailValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  modalActionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalApproveButton: {
    backgroundColor: '#10b981',
  },
  modalApproveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalRejectButton: {
    backgroundColor: '#ef4444',
  },
  modalRejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalCloseButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  documentCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  documentIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  documentFile: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Full Screen Modal styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullScreenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  fullScreenStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullScreenStatusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  fullScreenStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fullScreenContent: {
    flex: 1,
    padding: 20,
  },
  fullScreenActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  fullScreenActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  fullScreenApproveButton: {
    backgroundColor: '#10b981',
  },
  fullScreenApproveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenRejectButton: {
    backgroundColor: '#ef4444',
  },
  fullScreenRejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
