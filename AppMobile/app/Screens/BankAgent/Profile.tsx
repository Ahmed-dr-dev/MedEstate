import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

interface BankAgentProfile {
  bankName: string;
  agentName: string;
  employeeId: string;
  email: string;
  phone: string;
  branchAddress: string;
  licenseNumber: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

export default function BankAgentProfile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<BankAgentProfile>({
    bankName: 'First National Bank',
    agentName: user?.display_name || 'John Smith',
    employeeId: 'EMP001234',
    email: user?.email || 'john.smith@bank.com',
    phone: '+1 (555) 123-4567',
    branchAddress: '123 Main Street, New York, NY 10001',
    licenseNumber: 'LIC789456',
    isVerified: true,
    verificationStatus: 'approved',
  });

  const handleInputChange = (field: keyof BankAgentProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
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
      {isEditing && editable ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#94a3b8"
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
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
            <Text style={styles.greeting}>Bank Agent Profile 🏦</Text>
            <Text style={styles.userName}>Manage Your Information</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Verification Status */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <Text style={styles.verificationTitle}>Verification Status</Text>
            <View style={[
              styles.verificationBadge, 
              { backgroundColor: getVerificationStatusColor(profile.verificationStatus) + '20' }
            ]}>
              <Text style={styles.verificationIcon}>
                {getVerificationStatusIcon(profile.verificationStatus)}
              </Text>
              <Text style={[
                styles.verificationText, 
                { color: getVerificationStatusColor(profile.verificationStatus) }
              ]}>
                {profile.verificationStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.verificationDescription}>
            {profile.verificationStatus === 'approved' 
              ? 'Your bank agent account has been verified by our admin team. You can now process loan applications.'
              : profile.verificationStatus === 'pending'
              ? 'Your verification is under review. You will be notified once approved.'
              : 'Your verification was rejected. Please contact support for more information.'
            }
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Bank Information</Text>
          
          {renderProfileField('Bank Name', profile.bankName, 'bankName')}
          {renderProfileField('Agent Name', profile.agentName, 'agentName')}
          {renderProfileField('Employee ID', profile.employeeId, 'employeeId')}
          {renderProfileField('Email', profile.email, 'email')}
          {renderProfileField('Phone', profile.phone, 'phone')}
          {renderProfileField('Branch Address', profile.branchAddress, 'branchAddress')}
          {renderProfileField('License Number', profile.licenseNumber, 'licenseNumber')}
        </View>

        {/* Actions */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  verificationCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#1e293b',
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
    color: '#64748b',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldInput: {
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  saveButton: {
    backgroundColor: '#10b981',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
