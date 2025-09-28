import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import BottomNavigation from '../../../components/BankAgent/BottomNavigation';
import { API_BASE_URL } from '../../../constants/api';

interface BankAgentProfile {
  id: string;
  user_id: string;
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
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
}

export default function BankAgentProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  
  const [profile, setProfile] = useState<BankAgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -20,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    };

    setTimeout(() => createFloatingAnimation(floatAnim1, 0).start(), 500);
    setTimeout(() => createFloatingAnimation(floatAnim2, 1000).start(), 1000);
    setTimeout(() => createFloatingAnimation(floatAnim3, 2000).start(), 1500);
  }, []);

  const fetchProfileData = async () => {
    try {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/bank-agent-registration?user_id=${user.id}`);
      const result = await response.json();

      if (result.success && result.registrations && result.registrations.length > 0) {
        const latestRegistration = result.registrations[0];
        setProfile(latestRegistration);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BankAgentProfile, value: string) => {
    setProfile(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };


  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const renderProfileField = (label: string, value: string, field: keyof BankAgentProfile, editable: boolean = true) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataIcon}>📝</Text>
          <Text style={styles.noDataTitle}>No Registration Found</Text>
          <Text style={styles.noDataText}>You haven't completed your bank agent registration yet.</Text>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/Screens/BankAgent/Registration')}
          >
            <Text style={styles.registerButtonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
        <BottomNavigation />
      </View>
    );
  }

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
            <View style={styles.bankIconContainer}>
              <Text style={styles.bankIcon}>🏦</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Bank Agent Profile</Text>
              <Text style={styles.subtitle}>Manage Your Information</Text>
            </View>
          </View>
        </Animated.View>

        {/* Verification Status */}
        {profile && (
          <Animated.View 
            style={[
              styles.verificationCard,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.verificationHeader}>
              <Text style={styles.verificationTitle}>Registration Status</Text>
              <View style={[
                styles.verificationBadge, 
                { backgroundColor: getVerificationStatusColor(profile.status) + '20' }
              ]}>
                <Text style={styles.verificationIcon}>
                  {getVerificationStatusIcon(profile.status)}
                </Text>
                <Text style={[
                  styles.verificationText, 
                  { color: getVerificationStatusColor(profile.status) }
                ]}>
                  {profile.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.verificationDescription}>
              {profile.status === 'approved' 
                ? 'Your bank agent account has been verified by our admin team. You can now process loan applications.'
                : profile.status === 'pending'
                ? 'Your verification is under review. You will be notified once approved.'
                : 'Your verification was rejected. Please contact support for more information.'
              }
            </Text>
          </Animated.View>
        )}

        {/* Profile Information */}
        {profile && (
          <Animated.View 
            style={[
              styles.profileCard,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Essential Information</Text>
            {renderProfileField('Full Name', `${profile.first_name} ${profile.last_name}`, 'first_name')}
            {renderProfileField('Email', user?.email || 'N/A', 'first_name')}
            {renderProfileField('Phone', profile.phone, 'phone')}
            {renderProfileField('Bank Name', profile.bank_name, 'bank_name')}
            {renderProfileField('Position', profile.position, 'position')}
            {renderProfileField('Employee ID', profile.employee_id, 'employee_id')}
            {renderProfileField('Department', profile.department, 'department')}
            {renderProfileField('Registration Status', profile.status.toUpperCase(), 'status')}
            {renderProfileField('Registered Since', new Date(profile.submitted_at).toLocaleDateString(), 'submitted_at')}
          </Animated.View>
        )}


        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
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
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  verificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginTop: 20,
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
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verificationDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginTop: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fieldInput: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  saveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  noDataIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  noDataText: {
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
