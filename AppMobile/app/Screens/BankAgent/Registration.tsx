import React, { useState, useRef } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  experience: string;
  education: string;
}

interface BankInfo {
  bankName: string;
  bankCode: string;
  branchName: string;
  branchCode: string;
  position: string;
  employeeId: string;
  department: string;
  workAddress: string;
  supervisorName: string;
  supervisorPhone: string;
}

interface Documents {
  nationalIdDocument: string;
  bankEmploymentLetter: string;
  educationCertificate: string;
  experienceLetter: string;
}

export default function BankAgentRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationalId: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    experience: '',
    education: '',
  });

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: '',
    bankCode: '',
    branchName: '',
    branchCode: '',
    position: '',
    employeeId: '',
    department: '',
    workAddress: '',
    supervisorName: '',
    supervisorPhone: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    nationalIdDocument: '',
    bankEmploymentLetter: '',
    educationCertificate: '',
    experienceLetter: '',
  });

  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateStep = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      animateStep();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      animateStep();
    }
  };

  const validatePersonalInfo = () => {
    const required = ['firstName', 'lastName', 'nationalId', 'phone', 'address', 'city'];
    return required.every(field => personalInfo[field as keyof PersonalInfo].trim() !== '');
  };

  const validateBankInfo = () => {
    const required = ['bankName', 'branchName', 'position', 'employeeId', 'department'];
    return required.every(field => bankInfo[field as keyof BankInfo].trim() !== '');
  };

  const handleSubmit = () => {
    // Store data locally for now
    const registrationData = {
      personalInfo,
      bankInfo,
      documents,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    // In a real app, this would be sent to the backend
    console.log('Registration Data:', registrationData);
    
    Alert.alert(
      'Registration Submitted',
      'Your bank agent registration has been submitted for admin review. You can access your dashboard but functionality will be limited until approval.',
      [
        {
          text: 'Continue to Dashboard',
          onPress: () => router.replace('/Screens/BankAgent/Dashboard'),
        },
      ]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderPersonalInfoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Please provide your personal details</Text>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={personalInfo.firstName}
            onChangeText={(text) => setPersonalInfo({...personalInfo, firstName: text})}
            placeholder="Enter first name"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={personalInfo.lastName}
            onChangeText={(text) => setPersonalInfo({...personalInfo, lastName: text})}
            placeholder="Enter last name"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.dateOfBirth}
          onChangeText={(text) => setPersonalInfo({...personalInfo, dateOfBirth: text})}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#94a3b8"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>National ID *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.nationalId}
          onChangeText={(text) => setPersonalInfo({...personalInfo, nationalId: text})}
          placeholder="Enter national ID"
          placeholderTextColor="#94a3b8"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.phone}
          onChangeText={(text) => setPersonalInfo({...personalInfo, phone: text})}
          placeholder="Enter phone number"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.address}
          onChangeText={(text) => setPersonalInfo({...personalInfo, address: text})}
          placeholder="Enter full address"
          placeholderTextColor="#94a3b8"
          multiline
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={personalInfo.city}
            onChangeText={(text) => setPersonalInfo({...personalInfo, city: text})}
            placeholder="Enter city"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={personalInfo.postalCode}
            onChangeText={(text) => setPersonalInfo({...personalInfo, postalCode: text})}
            placeholder="Enter postal code"
            placeholderTextColor="#94a3b8"
            autoCorrect={false}
            editable={true}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.experience}
          onChangeText={(text) => setPersonalInfo({...personalInfo, experience: text})}
          placeholder="Enter years of banking experience"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Education</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.education}
          onChangeText={(text) => setPersonalInfo({...personalInfo, education: text})}
          placeholder="Enter highest education level"
          placeholderTextColor="#94a3b8"
          autoCapitalize="words"
          autoCorrect={false}
          editable={true}
        />
      </View>
    </View>
  );

  const renderBankInfoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Bank Information</Text>
      <Text style={styles.stepSubtitle}>Please provide your employment details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Name *</Text>
        <TextInput
          style={styles.input}
          value={bankInfo.bankName}
          onChangeText={(text) => setBankInfo({...bankInfo, bankName: text})}
          placeholder="Enter bank name"
          placeholderTextColor="#94a3b8"
          autoCapitalize="words"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Code</Text>
        <TextInput
          style={styles.input}
          value={bankInfo.bankCode}
          onChangeText={(text) => setBankInfo({...bankInfo, bankCode: text})}
          placeholder="Enter bank code"
          placeholderTextColor="#94a3b8"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Branch Name *</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.branchName}
            onChangeText={(text) => setBankInfo({...bankInfo, branchName: text})}
            placeholder="Enter branch name"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Branch Code</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.branchCode}
            onChangeText={(text) => setBankInfo({...bankInfo, branchCode: text})}
            placeholder="Enter branch code"
            placeholderTextColor="#94a3b8"
            autoCorrect={false}
            editable={true}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Position *</Text>
        <TextInput
          style={styles.input}
          value={bankInfo.position}
          onChangeText={(text) => setBankInfo({...bankInfo, position: text})}
          placeholder="Enter your position/title"
          placeholderTextColor="#94a3b8"
          autoCapitalize="words"
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Employee ID *</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.employeeId}
            onChangeText={(text) => setBankInfo({...bankInfo, employeeId: text})}
            placeholder="Enter employee ID"
            placeholderTextColor="#94a3b8"
            autoCorrect={false}
            editable={true}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Department *</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.department}
            onChangeText={(text) => setBankInfo({...bankInfo, department: text})}
            placeholder="Enter department"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Work Address</Text>
        <TextInput
          style={styles.input}
          value={bankInfo.workAddress}
          onChangeText={(text) => setBankInfo({...bankInfo, workAddress: text})}
          placeholder="Enter work address"
          placeholderTextColor="#94a3b8"
          multiline
          autoCorrect={false}
          editable={true}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Supervisor Name</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.supervisorName}
            onChangeText={(text) => setBankInfo({...bankInfo, supervisorName: text})}
            placeholder="Enter supervisor name"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            autoCorrect={false}
            editable={true}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Supervisor Phone</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.supervisorPhone}
            onChangeText={(text) => setBankInfo({...bankInfo, supervisorPhone: text})}
            placeholder="Enter supervisor phone"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            autoCorrect={false}
            editable={true}
          />
        </View>
      </View>
    </View>
  );

  const renderDocumentsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Document Upload</Text>
      <Text style={styles.stepSubtitle}>Upload required documents for verification</Text>

      <View style={styles.documentItem}>
        <Text style={styles.documentLabel}>National ID Document *</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📄 Choose File</Text>
        </TouchableOpacity>
        <Text style={styles.documentNote}>Upload a clear photo of your national ID</Text>
      </View>

      <View style={styles.documentItem}>
        <Text style={styles.documentLabel}>Bank Employment Letter *</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📄 Choose File</Text>
        </TouchableOpacity>
        <Text style={styles.documentNote}>Official employment letter from your bank</Text>
      </View>

      <View style={styles.documentItem}>
        <Text style={styles.documentLabel}>Education Certificate</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📄 Choose File</Text>
        </TouchableOpacity>
        <Text style={styles.documentNote}>Your highest education certificate</Text>
      </View>

      <View style={styles.documentItem}>
        <Text style={styles.documentLabel}>Experience Letter</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📄 Choose File</Text>
        </TouchableOpacity>
        <Text style={styles.documentNote}>Previous banking experience letter (if applicable)</Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>📋 Document Requirements:</Text>
        <Text style={styles.noteText}>• All documents must be clear and readable</Text>
        <Text style={styles.noteText}>• Accepted formats: JPG, PNG, PDF</Text>
        <Text style={styles.noteText}>• Maximum file size: 5MB per document</Text>
        <Text style={styles.noteText}>• Documents marked with * are required</Text>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepSubtitle}>Please review your information before submitting</Text>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Personal Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Name:</Text>
          <Text style={styles.reviewValue}>{personalInfo.firstName} {personalInfo.lastName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>National ID:</Text>
          <Text style={styles.reviewValue}>{personalInfo.nationalId}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Phone:</Text>
          <Text style={styles.reviewValue}>{personalInfo.phone}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Address:</Text>
          <Text style={styles.reviewValue}>{personalInfo.address}, {personalInfo.city}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Bank Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Bank:</Text>
          <Text style={styles.reviewValue}>{bankInfo.bankName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Branch:</Text>
          <Text style={styles.reviewValue}>{bankInfo.branchName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Position:</Text>
          <Text style={styles.reviewValue}>{bankInfo.position}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Employee ID:</Text>
          <Text style={styles.reviewValue}>{bankInfo.employeeId}</Text>
        </View>
      </View>

      <View style={styles.submitNote}>
        <Text style={styles.submitNoteText}>
          By submitting this application, you confirm that all information provided is accurate and complete. 
          Your application will be reviewed by our admin team within 2-3 business days.
        </Text>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderBankInfoStep();
      case 3:
        return renderDocumentsStep();
      case 4:
        return renderReviewStep();
      default:
        return renderPersonalInfoStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return validatePersonalInfo();
      case 2:
        return validateBankInfo();
      case 3:
        return true; // Documents are optional for now
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
            {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏦</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Bank Agent Registration</Text>
            <Text style={styles.subtitle}>Complete your profile to get started</Text>
          </View>
        </View>

      {renderProgressBar()}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              }],
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
              }),
            },
          ]}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.buttonSpacer} />
        
        {currentStep < totalSteps ? (
          <TouchableOpacity 
            style={[styles.nextButton, !canProceed() && styles.disabledButton]} 
            onPress={nextStep}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
    minHeight: 48,
    textAlignVertical: 'center',
  },
  documentItem: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  documentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
  documentNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  noteContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#1e40af',
    marginBottom: 4,
  },
  reviewSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: '#1e293b',
    flex: 2,
    textAlign: 'right',
  },
  submitNote: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  submitNoteText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  buttonSpacer: {
    flex: 1,
  },
  prevButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  prevButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
});
