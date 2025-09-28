import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import BottomNavigation from '../../../components/BankAgent/BottomNavigation';
import { API_BASE_URL } from '../../../constants/api';

const { width, height } = Dimensions.get('window');

interface LoanApplication {
  id: string;
  applicantName: string;
  propertyTitle: string;
  loanAmount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedDate: string;
  creditScore?: number;
  annualIncome: number;
  priority: 'high' | 'medium' | 'low';
}

interface BankAgentRegistration {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  bank_name: string;
  position: string;
}

export default function LoanReviewDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
  });
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'approved' | 'rejected' | 'not_registered' | 'loading'>('loading');
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const floatingAnimation1 = useRef(new Animated.Value(0)).current;
  const floatingAnimation2 = useRef(new Animated.Value(0)).current;
  const floatingAnimation3 = useRef(new Animated.Value(0)).current;
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideInAnimation = useRef(new Animated.Value(50)).current;

  const filters = [
    { id: 'all', label: 'All', count: stats.totalApplications },
    { id: 'approved', label: 'Approved', count: stats.approved },
    { id: 'pending', label: 'Pending', count: stats.pendingReview },
    { id: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  useEffect(() => {
    checkRegistrationAndFetchLoans();

    // Start animations
    const createFloatingAnimation = (animatedValue: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatingAnimation1, 4000, 0).start();
    createFloatingAnimation(floatingAnimation2, 3500, 1000).start();
    createFloatingAnimation(floatingAnimation3, 4500, 2000).start();

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideInAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkRegistrationAndFetchLoans = async () => {
    try {
      if (!user?.id) {
        setRegistrationStatus('not_registered');
        setIsLoading(false);
        return;
      }

      // Check registration status
      const registrationResponse = await fetch(`${API_BASE_URL}/bank-agent-registration?user_id=${user.id}`);
      const registrationResult = await registrationResponse.json();

      if (registrationResult.success && registrationResult.registrations && registrationResult.registrations.length > 0) {
        const latestRegistration = registrationResult.registrations[0];
        setRegistrationStatus(latestRegistration.status);
        
        // If approved, fetch loan applications
        if (latestRegistration.status === 'approved') {
          await fetchLoanApplications();
        }
      } else {
        setRegistrationStatus('not_registered');
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      setRegistrationStatus('not_registered');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoanApplications = async () => {
    try {
      console.log('Fetching loan applications for bank agent:', user?.id);
      const response = await fetch(`${API_BASE_URL}/loan-applications?bank_agent_id=${user?.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Loan applications API response:', result);

      if (result.success) {
        // Try different possible response structures
        const applicationsData = result.applications || result.data || result.loanApplications || [];
        console.log('Found loan applications:', applicationsData.length);

        // Transform API data to match our interface
        const transformedApplications: LoanApplication[] = applicationsData.map((app: any) => ({
          id: app.id,
          applicantName: app.applicant_name || app.applicantName || app.applicant?.display_name || 'Unknown',
          propertyTitle: app.property_title || app.propertyTitle || app.property?.title || 'Unknown Property',
          loanAmount: app.loan_amount || app.loanAmount || 0,
          status: app.status || 'pending',
          submittedDate: app.submitted_date || app.submittedDate || app.created_at || new Date().toISOString(),
          creditScore: app.credit_score || app.creditScore,
          annualIncome: app.annual_income || app.annualIncome || 0,
          priority: app.priority || 'medium', // Default priority if not provided
        }));

        setApplications(transformedApplications);
        
        // Update stats based on applications
        const newStats = {
          totalApplications: transformedApplications.length,
          pendingReview: transformedApplications.filter(app => app.status === 'pending').length,
          approved: transformedApplications.filter(app => app.status === 'approved').length,
          rejected: transformedApplications.filter(app => app.status === 'rejected').length,
        };
        setStats(newStats);
      } else {
        console.log('API returned error:', result.error);
        // If no applications or error, set empty array
        setApplications([]);
        setStats({
          totalApplications: 0,
          pendingReview: 0,
          approved: 0,
          rejected: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      // Set empty data on error
      setApplications([]);
      setStats({
        totalApplications: 0,
        pendingReview: 0,
        approved: 0,
        rejected: 0,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'under_review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleReviewApplication = (applicationId: string) => {
    router.push(`/Screens/BankAgent/LoanDetails?id=${applicationId}`);
  };

  const renderApplication = ({ item }: { item: LoanApplication }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() => handleReviewApplication(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicantName}>{item.applicantName}</Text>
          <Text style={styles.propertyTitle} numberOfLines={1}>{item.propertyTitle}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loan Amount:</Text>
          <Text style={styles.detailValue}>${item.loanAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Annual Income:</Text>
          <Text style={styles.detailValue}>${item.annualIncome.toLocaleString()}</Text>
        </View>
        {item.creditScore && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Credit Score:</Text>
            <Text style={[
              styles.detailValue,
              { color: item.creditScore >= 700 ? '#10b981' : item.creditScore >= 600 ? '#f59e0b' : '#ef4444' }
            ]}>
              {item.creditScore}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{item.submittedDate}</Text>
        </View>
      </View>

      <View style={styles.reviewButton}>
        <Text style={styles.reviewButtonText}>Review Application →</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Applications Found</Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all' 
          ? 'No loan applications to review at the moment'
          : `No ${selectedFilter.replace('_', ' ')} applications found`
        }
      </Text>
    </View>
  );

  const UnauthorizedAccess = () => (
    <View style={styles.unauthorizedContainer}>
      <Text style={styles.unauthorizedIcon}>🚫</Text>
      <Text style={styles.unauthorizedTitle}>Access Restricted</Text>
      <Text style={styles.unauthorizedText}>
        {registrationStatus === 'pending' && 'Your bank agent registration is still under review. Please wait for approval.'}
        {registrationStatus === 'rejected' && 'Your bank agent registration was rejected. Please contact support.'}
        {registrationStatus === 'not_registered' && 'You need to complete your bank agent registration to access loan applications.'}
      </Text>
      {registrationStatus === 'not_registered' && (
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => router.push('/Screens/BankAgent/Registration')}
        >
          <Text style={styles.registerButtonText}>Complete Registration</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (registrationStatus !== 'approved') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <UnauthorizedAccess />
        <BottomNavigation />
      </View>
    );
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && app.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View 
          style={[
            styles.floatingCircle, 
            styles.circle1,
            {
              transform: [{
                translateY: floatingAnimation1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            styles.circle2,
            {
              transform: [{
                translateY: floatingAnimation2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingSquare, 
            styles.square1,
            {
              transform: [{
                rotate: floatingAnimation3.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['45deg', '90deg'],
                })
              }]
            }
          ]} 
        />
      </View>

      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideInAnimation }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.agentName}>{user?.display_name || 'Bank Agent'}</Text>
              </View>
              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>🏦</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Review and manage loan applications</Text>
          </View>


          {/* Search */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Text style={styles.searchIconText}>🔍</Text>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search applications..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.id && styles.activeFilterButton
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedFilter === filter.id && styles.activeFilterButtonText
                  ]}>
                    {filter.label}
                  </Text>
                  <View style={[
                    styles.filterBadge,
                    selectedFilter === filter.id && styles.activeFilterBadge
                  ]}>
                    <Text style={[
                      styles.filterBadgeText,
                      selectedFilter === filter.id && styles.activeFilterBadgeText
                    ]}>
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Applications List */}
          <View style={styles.applicationsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>
              <Text style={styles.sectionCount}>{filteredApplications.length} items</Text>
            </View>
            
            {filteredApplications.length === 0 ? (
              <EmptyState />
            ) : (
              <View style={styles.applicationsList}>
                {filteredApplications.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    style={[
                      {
                        opacity: fadeInAnimation,
                        transform: [{
                          translateY: slideInAnimation.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 + (index * 10)],
                          })
                        }]
                      }
                    ]}
                  >
                    {renderApplication({ item })}
                  </Animated.View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingBottom: 80,
  },
  // Background gradient styles
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradientLayer1: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.6,
    backgroundColor: '#1e40af',
    borderRadius: width,
    top: -height * 0.2,
    left: -width * 0.25,
    opacity: 0.8,
  },
  gradientLayer2: {
    position: 'absolute',
    width: width * 1.2,
    height: height * 0.5,
    backgroundColor: '#3b82f6',
    borderRadius: width,
    top: -height * 0.1,
    right: -width * 0.1,
    opacity: 0.6,
  },
  gradientLayer3: {
    position: 'absolute',
    width: width,
    height: height * 0.4,
    backgroundColor: '#60a5fa',
    borderRadius: width,
    bottom: -height * 0.2,
    left: -width * 0.2,
    opacity: 0.4,
  },
  // Floating elements
  floatingElements: {
    position: 'absolute',
    width: width,
    height: height,
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 80,
    height: 80,
    top: height * 0.15,
    right: width * 0.1,
  },
  circle2: {
    width: 60,
    height: 60,
    top: height * 0.4,
    left: width * 0.05,
  },
  floatingSquare: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
  },
  square1: {
    width: 30,
    height: 30,
    top: height * 0.25,
    left: width * 0.15,
  },
  // Scroll view styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  agentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerIconText: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Stats container
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  approvedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  rejectedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Search styles
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchIconText: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
  },
  // Filter styles
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: 'white',
  },
  // Applications section
  applicationsSection: {
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  sectionCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  applicationsList: {
    flex: 1,
  },
  applicationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    marginRight: 12,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
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
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  reviewButton: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewButtonText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  unauthorizedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  unauthorizedText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
