import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import BottomNavigation from '../../../components/BankAgent/BottomNavigation';

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
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  
  // Mock approval status - in real app this would come from backend
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showApprovalModal, setShowApprovalModal] = useState(true);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations
    const createFloatingAnimation = (animValue: Animated.Value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatAnim1).start();
    setTimeout(() => createFloatingAnimation(floatAnim2).start(), 1000);
    setTimeout(() => createFloatingAnimation(floatAnim3).start(), 2000);
  }, []);

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

  const renderStatCard = (title: string, value: number, icon: string, color: string, subtitle: string) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      activeOpacity={0.9}
    >
      <View style={styles.statHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background Elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle1,
          {
            transform: [{ translateY: floatAnim1 }],
            left: width * 0.1,
            top: height * 0.15,
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.square1,
          {
            transform: [{ translateY: floatAnim2 }],
            right: width * 0.15,
            top: height * 0.25,
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle2,
          {
            transform: [{ translateY: floatAnim3 }],
            left: width * 0.7,
            bottom: height * 0.3,
          }
        ]} 
      />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.userName}>{user?.display_name || 'Bank Agent'}</Text>
              <Text style={styles.subtitle}>Ready to review applications</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Application Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Applications', stats.totalApplications, '📋', '#3b82f6', 'All loan requests')}
            {renderStatCard('Pending Review', stats.pendingApplications, '⏳', '#f59e0b', 'Awaiting review')}
            {renderStatCard('Approved', stats.approvedApplications, '✅', '#10b981', 'Successfully approved')}
            {renderStatCard('Rejected', stats.rejectedApplications, '❌', '#ef4444', 'Declined applications')}
          </View>
        </Animated.View>

      </Animated.ScrollView>

      {/* Approval Status Modal */}
      <Modal
        visible={showApprovalModal && approvalStatus === 'pending'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowApprovalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>⏳</Text>
              <Text style={styles.modalTitle}>Account Under Review</Text>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Your bank agent registration is currently being reviewed by our admin team.
              </Text>
              
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Text style={styles.modalStatusIcon}>✅</Text>
                  <Text style={styles.statusText}>Registration Submitted</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.modalStatusIcon}>⏳</Text>
                  <Text style={styles.statusText}>Under Admin Review</Text>
                </View>
                <View style={[styles.statusItem, styles.pendingStatus]}>
                  <Text style={styles.modalStatusIcon}>⭐</Text>
                  <Text style={styles.statusText}>Approval Pending</Text>
                </View>
              </View>
              
              <View style={styles.limitationsContainer}>
                <Text style={styles.limitationsTitle}>Current Limitations:</Text>
                <Text style={styles.limitationItem}>• Cannot process loan applications</Text>
                <Text style={styles.limitationItem}>• Limited access to client data</Text>
                <Text style={styles.limitationItem}>• Cannot approve/reject loans</Text>
              </View>
              
              <Text style={styles.modalNote}>
                You will receive a notification once your account is approved. 
                This typically takes 2-3 business days.
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowApprovalModal(false)}
              >
                <Text style={styles.modalButtonText}>I Understand</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Overlay for pending approval state */}
      {approvalStatus === 'pending' && !showApprovalModal && (
        <View style={styles.pendingOverlay}>
          <TouchableOpacity 
            style={styles.pendingBanner}
            onPress={() => setShowApprovalModal(true)}
          >
            <Text style={styles.pendingBannerIcon}>⏳</Text>
            <View style={styles.pendingBannerContent}>
              <Text style={styles.pendingBannerTitle}>Account Pending Approval</Text>
              <Text style={styles.pendingBannerSubtitle}>Tap for details</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingBottom: 80,
  },
  floatingElement: {
    position: 'absolute',
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
  },
  square1: {
    width: 80,
    height: 80,
    backgroundColor: '#8b5cf6',
    transform: [{ rotate: '45deg' }],
  },
  circle2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#06b6d4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bankIcon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    width: '48%',
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
    fontWeight: '400',
  },
  applicationsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  applicationsList: {
    gap: 16,
  },
  applicationCard: {
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
    color: 'white',
    marginBottom: 4,
  },
  propertyTitle: {
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  modalContent: {
    padding: 24,
  },
  modalDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  pendingStatus: {
    backgroundColor: '#fef3c7',
  },
  modalStatusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  limitationsContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  limitationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  limitationItem: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 4,
  },
  modalNote: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Pending overlay styles
  pendingOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  pendingBanner: {
    backgroundColor: '#fbbf24',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pendingBannerContent: {
    flex: 1,
  },
  pendingBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  pendingBannerSubtitle: {
    fontSize: 12,
    color: '#92400e',
    opacity: 0.8,
  },
});
