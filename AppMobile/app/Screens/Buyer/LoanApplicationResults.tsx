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
import { useRouter } from 'expo-router';
import { BuyerBottomNav } from '../../../components/Buyer/BuyerBottomNav';

interface LoanApplication {
  id: string;
  propertyTitle: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  expectedResponse: string;
  interestRate?: string;
  loanTerm?: string;
  monthlyPayment?: number;
}

export default function LoanApplicationResults() {
  const router = useRouter();
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showActionInfo, setShowActionInfo] = useState(false);
  const [actionInfo, setActionInfo] = useState<{title: string, content: string, type: string} | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: '1',
      propertyTitle: 'Modern Downtown Condo',
      bankName: 'First National Bank',
      amount: 680000,
      status: 'pending',
      submittedDate: '2024-01-15',
      expectedResponse: '2024-01-22',
      interestRate: '6.2%',
      loanTerm: '30 years',
      monthlyPayment: 4167
    },
    {
      id: '2',
      propertyTitle: 'Suburban Family Home',
      bankName: 'Metro Bank',
      amount: 960000,
      status: 'approved',
      submittedDate: '2024-01-10',
      expectedResponse: '2024-01-17',
      interestRate: '6.5%',
      loanTerm: '30 years',
      monthlyPayment: 6067
    },
    {
      id: '3',
      propertyTitle: 'Luxury Apartment',
      bankName: 'City Bank',
      amount: 520000,
      status: 'under_review',
      submittedDate: '2024-01-18',
      expectedResponse: '2024-01-25',
      interestRate: '6.8%',
      loanTerm: '30 years',
      monthlyPayment: 3390
    },
    {
      id: '4',
      propertyTitle: 'Beach House Villa',
      bankName: 'Regional Bank',
      amount: 1200000,
      status: 'rejected',
      submittedDate: '2024-01-05',
      expectedResponse: '2024-01-12',
      interestRate: '6.0%',
      loanTerm: '30 years',
      monthlyPayment: 7195
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'rejected', label: 'Rejected' }
  ];

  const filteredApplications = selectedFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'under_review':
        return '#3b82f6';
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'under_review':
        return '🔍';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your loan has been approved.';
      case 'pending':
        return 'Your application is being processed.';
      case 'under_review':
        return 'Your application is under review by our team.';
      case 'rejected':
        return 'Unfortunately, your application was not approved.';
      default:
        return 'Application status unknown.';
    }
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{applications.length}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: '#10b981' }]}>
          {applications.filter(app => app.status === 'approved').length}
        </Text>
        <Text style={styles.statLabel}>Approved</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
          {applications.filter(app => app.status === 'pending' || app.status === 'under_review').length}
        </Text>
        <Text style={styles.statLabel}>In Progress</Text>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter.key && styles.filterChipTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const handleApplicationPress = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleActionPress = (actionType: string, application: LoanApplication) => {
    let info = { title: '', content: '', type: actionType };
    
    switch (actionType) {
      case 'approved':
        info = {
          title: 'Approval Letter Details',
          content: `Congratulations! Your loan application for ${application.propertyTitle} has been approved by ${application.bankName}.\n\nApproval Details:\n• Loan Amount: $${application.amount.toLocaleString()}\n• Interest Rate: ${application.interestRate}\n• Monthly Payment: $${application.monthlyPayment?.toLocaleString()}\n• Loan Term: ${application.loanTerm}\n\nNext Steps:\n1. Review the approval letter\n2. Sign the loan documents\n3. Schedule closing date\n4. Prepare down payment\n\nYour loan officer will contact you within 2 business days to proceed with the closing process.`,
          type: 'approved'
        };
        break;
      case 'rejected':
        info = {
          title: 'Rejection Details',
          content: `Unfortunately, your loan application for ${application.propertyTitle} was not approved by ${application.bankName}.\n\nRejection Reasons:\n• Credit score below minimum requirement (Current: 680, Required: 720)\n• Debt-to-income ratio too high (Current: 45%, Maximum: 43%)\n• Insufficient employment history (Required: 2 years, Current: 1.5 years)\n\nRecommendations:\n1. Improve your credit score by paying down existing debt\n2. Reduce monthly debt payments\n3. Maintain stable employment for 6 more months\n4. Consider a smaller loan amount\n\nYou can reapply after addressing these issues. Our team is available to help you improve your application.`,
          type: 'rejected'
        };
        break;
      case 'pending':
        info = {
          title: 'Application Progress',
          content: `Your loan application for ${application.propertyTitle} is currently being processed by ${application.bankName}.\n\nCurrent Status:\n• Application submitted: ${application.submittedDate}\n• Initial review: Completed\n• Document verification: In progress\n• Credit check: Completed\n• Property appraisal: Scheduled\n\nExpected Timeline:\n• Document review: 2-3 business days\n• Property appraisal: 5-7 business days\n• Final decision: ${application.expectedResponse}\n\nWhat's Next:\n• Our team will contact you if additional documents are needed\n• You'll receive updates via email and SMS\n• Final decision will be communicated by ${application.expectedResponse}\n\nYou can track your application status in real-time through our online portal.`,
          type: 'pending'
        };
        break;
      case 'under_review':
        info = {
          title: 'Bank Contact Information',
          content: `Contact ${application.bankName} for your loan application regarding ${application.propertyTitle}.\n\nBank Contact Details:\n• Loan Officer: Sarah Johnson\n• Direct Phone: (555) 123-4567\n• Email: sarah.johnson@${application.bankName.toLowerCase().replace(/\s+/g, '')}.com\n• Office Hours: Monday-Friday, 9 AM - 5 PM\n\nApplication Reference:\n• Application ID: LA-${application.id.padStart(6, '0')}\n• Property: ${application.propertyTitle}\n• Loan Amount: $${application.amount.toLocaleString()}\n\nWhat to Discuss:\n• Current application status\n• Required documentation\n• Timeline updates\n• Any questions or concerns\n\nPlease have your application reference number ready when calling. The loan officer will have access to your complete application file.`,
          type: 'under_review'
        };
        break;
    }
    
    setActionInfo(info);
    setShowActionInfo(true);
  };

  const renderApplicationCard = (application: LoanApplication) => (
    <TouchableOpacity 
      key={application.id} 
      style={styles.applicationCard}
      onPress={() => handleApplicationPress(application)}
    >
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationProperty}>{application.propertyTitle}</Text>
          <Text style={styles.applicationBank}>{application.bankName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(application.status)}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.statusMessage}>
        <Text style={styles.statusMessageText}>{getStatusMessage(application.status)}</Text>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loan Amount:</Text>
          <Text style={styles.detailValue}>${application.amount.toLocaleString()}</Text>
        </View>
        {application.monthlyPayment && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Payment:</Text>
            <Text style={styles.detailValue}>${application.monthlyPayment.toLocaleString()}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{application.submittedDate}</Text>
        </View>
      </View>

      <View style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>No Applications Found</Text>
      <Text style={styles.emptyStateText}>
        {selectedFilter === 'all' 
          ? "You haven't submitted any loan applications yet."
          : `No ${selectedFilter} applications found.`
        }
      </Text>
      {selectedFilter !== 'all' && (
        <TouchableOpacity 
          style={styles.clearFilterButton}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={styles.clearFilterButtonText}>Show All Applications</Text>
        </TouchableOpacity>
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Application Results 📊</Text>
            <Text style={styles.userName}>Track Your Loan Applications</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpIcon}>❓</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {renderStats()}

        {/* Filters */}
        {renderFilters()}

        {/* Applications List */}
        <View style={styles.applicationsSection}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'all' ? 'All Applications' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Applications`}
          </Text>
          
          {filteredApplications.length > 0 ? (
            filteredApplications.map(renderApplicationCard)
          ) : (
            renderEmptyState()
          )}
        </View>

      </ScrollView>

      {/* Application Details Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedApplication && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Application Details</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalPropertyInfo}>
                    <Text style={styles.modalPropertyTitle}>{selectedApplication.propertyTitle}</Text>
                    <Text style={styles.modalBankName}>{selectedApplication.bankName}</Text>
                    <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedApplication.status) + '20' }]}>
                      <Text style={styles.modalStatusIcon}>{getStatusIcon(selectedApplication.status)}</Text>
                      <Text style={[styles.modalStatusText, { color: getStatusColor(selectedApplication.status) }]}>
                        {selectedApplication.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailsSection}>
                    <Text style={styles.modalSectionTitle}>Loan Information</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Loan Amount:</Text>
                      <Text style={styles.modalDetailValue}>${selectedApplication.amount.toLocaleString()}</Text>
                    </View>
                    {selectedApplication.monthlyPayment && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Monthly Payment:</Text>
                        <Text style={styles.modalDetailValue}>${selectedApplication.monthlyPayment.toLocaleString()}</Text>
                      </View>
                    )}
                    {selectedApplication.interestRate && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Interest Rate:</Text>
                        <Text style={styles.modalDetailValue}>{selectedApplication.interestRate}</Text>
                      </View>
                    )}
                    {selectedApplication.loanTerm && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Loan Term:</Text>
                        <Text style={styles.modalDetailValue}>{selectedApplication.loanTerm}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalDetailsSection}>
                    <Text style={styles.modalSectionTitle}>Application Timeline</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Submitted:</Text>
                      <Text style={styles.modalDetailValue}>{selectedApplication.submittedDate}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Expected Response:</Text>
                      <Text style={styles.modalDetailValue}>{selectedApplication.expectedResponse}</Text>
                    </View>
                  </View>

                  <View style={styles.modalStatusMessage}>
                    <Text style={styles.modalStatusMessageText}>{getStatusMessage(selectedApplication.status)}</Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  {selectedApplication.status === 'approved' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#10b981' }]}
                      onPress={() => handleActionPress('approved', selectedApplication)}
                    >
                      <Text style={styles.modalActionButtonText}>View Approval Details</Text>
                    </TouchableOpacity>
                  )}
                  {selectedApplication.status === 'rejected' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#ef4444' }]}
                      onPress={() => handleActionPress('rejected', selectedApplication)}
                    >
                      <Text style={styles.modalActionButtonText}>View Rejection Details</Text>
                    </TouchableOpacity>
                  )}
                  {selectedApplication.status === 'pending' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#f59e0b' }]}
                      onPress={() => handleActionPress('pending', selectedApplication)}
                    >
                      <Text style={styles.modalActionButtonText}>Track Progress</Text>
                    </TouchableOpacity>
                  )}
                  {selectedApplication.status === 'under_review' && (
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#3b82f6' }]}
                      onPress={() => handleActionPress('under_review', selectedApplication)}
                    >
                      <Text style={styles.modalActionButtonText}>Contact Bank</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.modalActionButton, { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }]}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={[styles.modalActionButtonText, { color: '#64748b' }]}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Action Information Modal */}
      <Modal
        visible={showActionInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActionInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionInfoModalContent}>
            {actionInfo && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{actionInfo.title}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowActionInfo(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.actionInfoBody}>
                  <View style={[
                    styles.actionInfoIcon,
                    { backgroundColor: actionInfo.type === 'approved' ? '#dcfce7' : 
                                      actionInfo.type === 'rejected' ? '#fef2f2' :
                                      actionInfo.type === 'pending' ? '#fef3c7' : '#e0f2fe' }
                  ]}>
                    <Text style={styles.actionInfoEmoji}>
                      {actionInfo.type === 'approved' ? '✅' :
                       actionInfo.type === 'rejected' ? '❌' :
                       actionInfo.type === 'pending' ? '⏳' : '📞'}
                    </Text>
                  </View>
                  
                  <Text style={styles.actionInfoContent}>{actionInfo.content}</Text>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalActionButton, { backgroundColor: '#3b82f6' }]}
                    onPress={() => setShowActionInfo(false)}
                  >
                    <Text style={styles.modalActionButtonText}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
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
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filtersScroll: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
  applicationsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicationInfo: {
    flex: 1,
  },
  applicationProperty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  applicationBank: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusMessage: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statusMessageText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  applicationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  viewDetailsButton: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  viewDetailsText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clearFilterButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  modalPropertyInfo: {
    marginBottom: 24,
  },
  modalPropertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalBankName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  modalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalStatusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalDetailsSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalStatusMessage: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalStatusMessageText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  modalActionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Action Info Modal Styles
  actionInfoModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  actionInfoBody: {
    flex: 1,
    padding: 20,
  },
  actionInfoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  actionInfoEmoji: {
    fontSize: 40,
  },
  actionInfoContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    textAlign: 'left',
  },
});
