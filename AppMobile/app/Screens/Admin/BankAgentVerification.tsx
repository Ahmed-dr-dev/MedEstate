import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { API_BASE_URL } from '../../../constants/api';

interface BankAgentRequest {
  id: string;
  user_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  national_id: string;
  phone: string;
  address: string;
  city: string;
  postal_code?: string;
  bank_name: string;
  position: string;
  employee_id: string;
  department: string;
  work_address?: string;
  supervisor_name?: string;
  supervisor_phone: string;
  national_id_document?: string;
  bank_employment_letter?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
  age: number;
  formatted_submitted_at: string;
  formatted_reviewed_at?: string;
  user?: {
    id: string;
    email: string;
    display_name?: string;
  };
}

export default function BankAgentVerification() {
  const [bankAgentRequests, setBankAgentRequests] = useState<BankAgentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BankAgentRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBankAgentRequests();
  }, []);

  const fetchBankAgentRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/bank-agents`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setBankAgentRequests(result.data.requests);
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch bank agent requests');
      }
    } catch (error) {
      console.error('Error fetching bank agent requests:', error);
      Alert.alert('Error', 'Failed to fetch bank agent requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected', notes?: string, rejectionReason?: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/bank-agents`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          status,
          admin_notes: notes,
          rejection_reason: rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', `Bank agent request ${status} successfully!`);
        closeModal();
        fetchBankAgentRequests(); // Refresh the list
      } else {
        Alert.alert('Error', result.error || 'Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      Alert.alert('Error', 'Failed to update request status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleStatusAction = (requestId: string, action: 'approve' | 'reject') => {
    const request = bankAgentRequests.find(req => req.id === requestId);
    if (!request) return;

    const status = action === 'approve' ? 'approved' : 'rejected';

    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this bank agent request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Reject',
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: () => updateRequestStatus(requestId, status)
        }
      ]
    );
  };

  const openRequestModal = (request: BankAgentRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setRejectionReason(request.rejection_reason || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setAdminNotes('');
    setRejectionReason('');
  };

  const handleModalAction = (action: 'approve' | 'reject') => {
    if (!selectedRequest) return;
    
    if (action === 'reject' && !rejectionReason.trim()) {
      Alert.alert('Required', 'Please provide a rejection reason.');
      return;
    }
    
    const status = action === 'approve' ? 'approved' : 'rejected';
    updateRequestStatus(
      selectedRequest.id, 
      status, 
      adminNotes.trim() || undefined, 
      action === 'reject' ? rejectionReason.trim() : undefined
    );
  };

  const openDocument = async (documentUrl: string, documentName: string) => {
    try {
      const canOpen = await Linking.canOpenURL(documentUrl);
      if (canOpen) {
        await Linking.openURL(documentUrl);
      } else {
        Alert.alert('Error', `Cannot open ${documentName}. Invalid URL.`);
      }
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', `Failed to open ${documentName}. Please try again.`);
    }
  };

  const renderRequestCard = (request: BankAgentRequest) => (
    <TouchableOpacity 
      key={request.id} 
      style={styles.requestCard}
      onPress={() => openRequestModal(request)}
      activeOpacity={0.8}
    >
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={styles.agentName}>{request.full_name}</Text>
          <Text style={styles.bankName}>{request.bank_name}</Text>
          <Text style={styles.position}>{request.position}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(request.status)}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {request.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <Text style={styles.detailText}>📞 {request.phone}</Text>
        <Text style={styles.detailText}>📅 Submitted: {request.formatted_submitted_at}</Text>
        {request.formatted_reviewed_at && (
          <Text style={styles.detailText}>✅ Reviewed: {request.formatted_reviewed_at}</Text>
        )}
      </View>

      {request.status === 'pending' && (
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.approveButton]}
            onPress={() => handleStatusAction(request.id, 'approve')}
          >
            <Text style={styles.quickActionText}>✓ Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.rejectButton]}
            onPress={() => handleStatusAction(request.id, 'reject')}
          >
            <Text style={styles.quickActionText}>✗ Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Full Details →</Text>
      </View>
    </TouchableOpacity>
  );

  const pendingCount = bankAgentRequests.filter(req => req.status === 'pending').length;
  const approvedCount = bankAgentRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = bankAgentRequests.filter(req => req.status === 'rejected').length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading bank agent requests...</Text>
      </View>
    );
  }

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

      {/* Bank Agent Requests List */}
      <View style={styles.requestsSection}>
        <Text style={styles.sectionTitle}>Bank Agent Applications</Text>
        <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
          {bankAgentRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Bank Agent Requests</Text>
              <Text style={styles.emptyText}>No bank agent applications found.</Text>
            </View>
          ) : (
            bankAgentRequests.map(renderRequestCard)
          )}
        </ScrollView>
      </View>

      {/* Bank Agent Request Details Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.fullScreenModal}>
          {selectedRequest && (
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
                  <View style={[styles.fullScreenStatusBadge, { backgroundColor: getStatusColor(selectedRequest.status) + '20' }]}>
                    <Text style={styles.fullScreenStatusIcon}>{getStatusIcon(selectedRequest.status)}</Text>
                    <Text style={[styles.fullScreenStatusText, { color: getStatusColor(selectedRequest.status) }]}>
                      {selectedRequest.status.toUpperCase()}
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
                    <Text style={styles.modalDetailLabel}>Full Name:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.full_name}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Phone:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.phone}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>National ID:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.national_id}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Date of Birth:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.date_of_birth}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Age:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.age} years</Text>
                  </View>
                </View>

                {/* Address Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Address Information</Text>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Address:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.address}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>City:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.city}</Text>
                  </View>
                  {selectedRequest.postal_code && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Postal Code:</Text>
                      <Text style={styles.modalDetailValue}>{selectedRequest.postal_code}</Text>
                    </View>
                  )}
                </View>

                {/* Bank Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Bank Information</Text>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Bank Name:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.bank_name}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Position:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.position}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Employee ID:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.employee_id}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Department:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.department}</Text>
                  </View>
                  {selectedRequest.work_address && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Work Address:</Text>
                      <Text style={styles.modalDetailValue}>{selectedRequest.work_address}</Text>
                    </View>
                  )}
                  {selectedRequest.supervisor_name && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Supervisor:</Text>
                      <Text style={styles.modalDetailValue}>{selectedRequest.supervisor_name}</Text>
                    </View>
                  )}
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Supervisor Phone:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.supervisor_phone}</Text>
                  </View>
                </View>

                {/* Application Details */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Application Details</Text>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Submitted:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.formatted_submitted_at}</Text>
                  </View>
                  {selectedRequest.formatted_reviewed_at && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Reviewed:</Text>
                      <Text style={styles.modalDetailValue}>{selectedRequest.formatted_reviewed_at}</Text>
                    </View>
                  )}
                  {selectedRequest.rejection_reason && (
                    <View style={styles.rejectionReasonBox}>
                      <Text style={styles.rejectionReasonLabel}>Rejection Reason:</Text>
                      <Text style={styles.rejectionReasonText}>{selectedRequest.rejection_reason}</Text>
                    </View>
                  )}
                  {selectedRequest.admin_notes && (
                    <View style={styles.adminNotesBox}>
                      <Text style={styles.adminNotesLabel}>Admin Notes:</Text>
                      <Text style={styles.adminNotesText}>{selectedRequest.admin_notes}</Text>
                    </View>
                  )}
                </View>

                {/* Documents Section */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Submitted Documents</Text>
                  <View style={styles.documentsGrid}>
                    {selectedRequest.national_id_document && (
                      <TouchableOpacity 
                        style={styles.documentCard}
                        onPress={() => openDocument(selectedRequest.national_id_document!, 'National ID')}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.documentIcon}>🆔</Text>
                        <Text style={styles.documentName}>National ID</Text>
                        <Text style={styles.documentFile}>Tap to View</Text>
                      </TouchableOpacity>
                    )}
                    {selectedRequest.bank_employment_letter && (
                      <TouchableOpacity 
                        style={styles.documentCard}
                        onPress={() => openDocument(selectedRequest.bank_employment_letter!, 'Employment Letter')}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.documentIcon}>📄</Text>
                        <Text style={styles.documentName}>Employment Letter</Text>
                        <Text style={styles.documentFile}>Tap to View</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {!selectedRequest.national_id_document && !selectedRequest.bank_employment_letter && (
                    <Text style={styles.noDocumentsText}>No documents uploaded</Text>
                  )}
                </View>

                {/* Admin Actions Section */}
                {selectedRequest.status === 'pending' && (
                  <>
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Rejection Reason (Required if rejecting) *</Text>
                      <TextInput
                        style={styles.notesInput}
                        placeholder="Provide reason if rejecting this application..."
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={rejectionReason}
                        onChangeText={setRejectionReason}
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                    
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Admin Notes (Optional)</Text>
                      <TextInput
                        style={styles.notesInput}
                        placeholder="Add additional notes..."
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={adminNotes}
                        onChangeText={setAdminNotes}
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                  </>
                )}
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.fullScreenActions}>
                {selectedRequest.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.fullScreenActionButton, styles.fullScreenApproveButton]}
                      onPress={() => handleModalAction('approve')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.fullScreenApproveButtonText}>Approve Agent</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.fullScreenActionButton, styles.fullScreenRejectButton]}
                      onPress={() => handleModalAction('reject')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.fullScreenRejectButtonText}>Reject Agent</Text>
                      )}
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
    backgroundColor: '#1e293b',
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
  requestsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestsList: {
    flex: 1,
  },
  requestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestInfo: {
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
    marginBottom: 2,
  },
  position: {
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
  requestDetails: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailsButton: {
    alignItems: 'center',
  },
  viewDetailsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
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
  rejectionReasonBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectionReasonLabel: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 8,
  },
  rejectionReasonText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  adminNotesBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  adminNotesLabel: {
    fontSize: 14,
    color: '#c084fc',
    fontWeight: '600',
    marginBottom: 8,
  },
  adminNotesText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  documentCard: {
    width: '48%',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#60a5fa',
    textAlign: 'center',
    fontWeight: '500',
  },
  noDocumentsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 14,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    justifyContent: 'center',
    minHeight: 48,
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