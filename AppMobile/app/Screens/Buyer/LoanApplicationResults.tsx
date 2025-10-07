import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/constants/api';

interface LoanApplication {
  id: string;
  property_id?: string;
  applicant_id: string;
  loan_amount: number;
  loan_term_years: number;
  interest_rate?: number;
  monthly_payment?: number;
  employment_status: string;
  annual_income: number;
  identity_card_image?: string;
  proof_of_income_image?: string;
  selected_bank_id?: string;
  include_insurance: boolean;
  monthly_insurance_amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submitted_documents: string[];
  bank_agent_decision?: string;
  bank_agent_notes?: string;
  bank_agent_id?: string;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
    location: string;
    images?: string[];
  };
}

export default function LoanApplicationResults() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showActionInfo, setShowActionInfo] = useState(false);
  const [actionInfo, setActionInfo] = useState<{title: string, content: string, type: string} | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'rejected', label: 'Rejected' }
  ];

  // Fetch loan applications on component mount
  useEffect(() => {
    if (user?.id) {
      fetchLoanApplications();
    }
  }, [user?.id]);

  const fetchLoanApplications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/loan-applications?applicant_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.applications)) {
        setApplications(result.applications);
      } else {
        console.error('API response error:', result);
        Alert.alert('Error', result.error || 'Failed to fetch loan applications');
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      Alert.alert('Error', 'Failed to fetch loan applications. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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
    const propertyTitle = application.property?.title || 'Property';
    const bankName = getBankName(application.selected_bank_id);
    
    switch (actionType) {
      case 'approved':
        info = {
          title: 'Approval Letter Details',
          content: `Congratulations! Your loan application for ${propertyTitle} has been approved by our bank agent.\n\nApproval Details:\n• Loan Amount: ${application.loan_amount.toLocaleString()} د.ت\n• Interest Rate: ${application.interest_rate ? (application.interest_rate * 100).toFixed(1) : 'N/A'}%\n• Monthly Payment: ${application.monthly_payment?.toLocaleString()} د.ت\n• Loan Term: ${application.loan_term_years} years\n• Selected Bank: ${getBankName(application.selected_bank_id)}\n\nBank Agent Decision:\n${application.bank_agent_decision || 'Application approved based on standard criteria.'}\n\nAdditional Notes:\n${application.bank_agent_notes || 'No additional notes provided.'}\n\nNext Steps:\n1. Review the approval letter\n2. Sign the loan documents\n3. Schedule closing date with your selected bank\n4. Prepare down payment\n\nYour loan officer will contact you within 2 business days to proceed with the closing process.`,
          type: 'approved'
        };
        break;
      case 'rejected':
        info = {
          title: 'Rejection Details',
          content: `Unfortunately, your loan application for ${propertyTitle} was not approved by our bank agent.\n\nSelected Bank: ${getBankName(application.selected_bank_id)}\n\nBank Agent Decision:\n${application.bank_agent_decision || 'Application rejected based on standard criteria.'}\n\nRejection Reasons:\n${application.bank_agent_notes || '• Credit score below minimum requirement\n• Debt-to-income ratio too high\n• Insufficient employment history'}\n\nRecommendations:\n1. Improve your credit score by paying down existing debt\n2. Reduce monthly debt payments\n3. Maintain stable employment for 6 more months\n4. Consider a smaller loan amount\n\nYou can reapply after addressing these issues. Our team is available to help you improve your application.`,
          type: 'rejected'
        };
        break;
      case 'pending':
        info = {
          title: 'Application Progress',
          content: `Your loan application for ${propertyTitle} is currently being processed by our bank agent.\n\nSelected Bank: ${getBankName(application.selected_bank_id)}\n\nCurrent Status:\n• Application submitted: ${new Date(application.created_at).toLocaleDateString()}\n• Initial review: Completed\n• Document verification: In progress\n• Credit check: Completed\n• Property appraisal: Scheduled\n\nExpected Timeline:\n• Document review: 2-3 business days\n• Property appraisal: 5-7 business days\n• Final decision: Within 7-10 business days\n\nWhat's Next:\n• Our bank agent will contact you if additional documents are needed\n• You'll receive updates via email and SMS\n• Final decision will be communicated within 7-10 business days\n\nYou can track your application status in real-time through our online portal.`,
          type: 'pending'
        };
        break;
      case 'under_review':
        info = {
          title: 'Bank Contact Information',
          content: `Contact our bank agent for your loan application regarding ${propertyTitle}.\n\nApplication Reference:\n• Application ID: LA-${application.id.slice(-6)}\n• Property: ${propertyTitle}\n• Selected Bank: ${getBankName(application.selected_bank_id)}\n• Loan Amount: ${application.loan_amount.toLocaleString()} د.ت\n• Bank Agent ID: ${application.bank_agent_id || 'default-bank-agent-id'}\n\nWhat to Discuss:\n• Current application status\n• Required documentation\n• Timeline updates\n• Any questions or concerns\n\nPlease have your application reference number ready when calling. The bank agent will have access to your complete application file.`,
          type: 'under_review'
        };
        break;
    }
    
    setActionInfo(info);
    setShowActionInfo(true);
  };

  const getBankName = (bankId?: string) => {
    const bankMap: { [key: string]: string } = {
      '1': 'Banque de Tunisie',
      '2': 'Banque Internationale Arabe de Tunisie (BIAT)',
      '3': 'Banque de l\'Habitat (BH)',
      '4': 'Attijari Bank',
      '5': 'Banque Zitouna',
      '6': 'Banque Nationale Agricole (BNA)',
      '7': 'Qatar National Bank (QNB)',
      '8': 'Arab Tunisian Bank (ATB)'
    };
    return bankMap[bankId || ''] || 'Selected Bank';
  };

  const renderApplicationCard = (application: LoanApplication) => (
    <TouchableOpacity 
      key={application.id} 
      style={styles.applicationCard}
      onPress={() => handleApplicationPress(application)}
    >
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationProperty}>{application.property?.title || 'Property'}</Text>
          <Text style={styles.applicationBank}>{getBankName(application.selected_bank_id)}</Text>
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

      {/* Bank Agent Decision and Notes */}
      {(application.status === 'approved' || application.status === 'rejected') && (application.bank_agent_decision || application.bank_agent_notes) && (
        <View style={styles.decisionContainer}>
          <View style={styles.decisionHeader}>
            <Text style={styles.decisionTitle}>
              {application.status === 'approved' ? '✅ Approval Details' : '❌ Rejection Details'}
            </Text>
          </View>
          
          {application.bank_agent_decision && (
            <View style={styles.decisionSection}>
              <Text style={styles.decisionLabel}>Bank Agent Decision:</Text>
              <Text style={styles.decisionText}>{application.bank_agent_decision}</Text>
            </View>
          )}
          
          {application.bank_agent_notes && (
            <View style={styles.decisionSection}>
              <Text style={styles.decisionLabel}>Additional Notes:</Text>
              <Text style={styles.decisionText}>{application.bank_agent_notes}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loan Amount:</Text>
          <Text style={styles.detailValue}>{application.loan_amount.toLocaleString()} د.ت</Text>
        </View>
        {application.monthly_payment && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Payment:</Text>
            <Text style={styles.detailValue}>{application.monthly_payment.toLocaleString()} د.ت</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{new Date(application.created_at).toLocaleDateString()}</Text>
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
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
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
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
          ) : filteredApplications.length > 0 ? (
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
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.fullScreenModal}>
          <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
          <View style={styles.modalContent}>
            {selectedApplication && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.backButtonIcon}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Application Details</Text>
                  <View style={styles.backButton} />
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalPropertyInfo}>
                    <Text style={styles.modalPropertyTitle}>{selectedApplication.property?.title || 'Property'}</Text>
                    <Text style={styles.modalBankName}>{getBankName(selectedApplication.selected_bank_id)}</Text>
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
                      <Text style={styles.modalDetailValue}>{selectedApplication.loan_amount.toLocaleString()} د.ت</Text>
                    </View>
                    {selectedApplication.monthly_payment && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Monthly Payment:</Text>
                        <Text style={styles.modalDetailValue}>{selectedApplication.monthly_payment.toLocaleString()} د.ت</Text>
                      </View>
                    )}
                    {selectedApplication.interest_rate && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Interest Rate:</Text>
                        <Text style={styles.modalDetailValue}>{(selectedApplication.interest_rate * 100).toFixed(1)}%</Text>
                      </View>
                    )}
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Loan Term:</Text>
                      <Text style={styles.modalDetailValue}>{selectedApplication.loan_term_years} years</Text>
                    </View>
                  </View>

                  <View style={styles.modalDetailsSection}>
                    <Text style={styles.modalSectionTitle}>Application Timeline</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Submitted:</Text>
                      <Text style={styles.modalDetailValue}>{new Date(selectedApplication.created_at).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Last Updated:</Text>
                      <Text style={styles.modalDetailValue}>{new Date(selectedApplication.updated_at).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  {selectedApplication.bank_agent_notes && (
                    <View style={styles.modalDetailsSection}>
                      <Text style={styles.modalSectionTitle}>Bank Agent Notes</Text>
                      <Text style={styles.modalDetailValue}>{selectedApplication.bank_agent_notes}</Text>
                    </View>
                  )}

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
                    style={[styles.modalActionButton, { backgroundColor: '#475569', borderWidth: 1, borderColor: '#64748b' }]}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={[styles.modalActionButtonText, { color: '#e2e8f0' }]}>Close</Text>
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
        transparent={false}
        onRequestClose={() => setShowActionInfo(false)}
      >
        <View style={styles.fullScreenModal}>
          <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
          <View style={styles.actionInfoModalContent}>
            {actionInfo && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setShowActionInfo(false)}
                  >
                    <Text style={styles.backButtonIcon}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{actionInfo.title}</Text>
                  <View style={styles.backButton} />
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
                    style={[styles.modalActionButton, { backgroundColor: '#0ea5e9' }]}
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

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
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
    backgroundColor: '#1e293b',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
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
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
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
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterChipText: {
    fontSize: 14,
    color: '#94a3b8',
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
    color: '#f8fafc',
    marginBottom: 16,
  },
  applicationCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#475569',
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
    color: '#f8fafc',
    marginBottom: 4,
  },
  applicationBank: {
    fontSize: 14,
    color: '#94a3b8',
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
    backgroundColor: '#475569',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statusMessageText: {
    fontSize: 14,
    color: '#94a3b8',
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
    color: '#94a3b8',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
  },
  viewDetailsButton: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  viewDetailsText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  decisionContainer: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  decisionHeader: {
    marginBottom: 12,
  },
  decisionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  decisionSection: {
    marginBottom: 12,
  },
  decisionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  decisionText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
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
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterButton: {
    backgroundColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#64748b',
  },
  clearFilterButtonText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 12,
  },
  // Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
    textAlign: 'center',
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
    color: '#f8fafc',
    marginBottom: 4,
  },
  modalBankName: {
    fontSize: 14,
    color: '#94a3b8',
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
    color: '#f8fafc',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  modalStatusMessage: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalStatusMessageText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#475569',
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
    flex: 1,
    backgroundColor: '#1e293b',
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
    color: '#f8fafc',
    textAlign: 'left',
  },
});

