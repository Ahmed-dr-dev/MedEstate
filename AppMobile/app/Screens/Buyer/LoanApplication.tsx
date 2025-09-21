import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

interface LoanFormData {
  loanType: 'pre_approval' | 'specific_property';
  propertyAddress?: string;
  estimatedPropertyValue?: string;
  annualIncome: string;
  employmentStatus: string;
  creditScore: string;
  downPayment: string;
  loanAmount: string;
  loanTerm: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phone: string;
    email: string;
  };
  employmentInfo: {
    employer: string;
    jobTitle: string;
    yearsEmployed: string;
    monthlyIncome: string;
  };
}

export default function LoanApplication() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>({
    loanType: 'pre_approval',
    propertyAddress: '',
    estimatedPropertyValue: '',
    annualIncome: '',
    employmentStatus: 'employed',
    creditScore: '',
    downPayment: '',
    loanAmount: '',
    loanTerm: '30',
    personalInfo: {
      firstName: user?.display_name?.split(' ')[0] || '',
      lastName: user?.display_name?.split(' ')[1] || '',
      dateOfBirth: '',
      ssn: '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
    employmentInfo: {
      employer: '',
      jobTitle: '',
      yearsEmployed: '',
      monthlyIncome: '',
    },
  });

  const handleInputChange = (section: keyof LoanFormData | '', field: string, value: string) => {
    if (section === 'personalInfo' || section === 'employmentInfo') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const { firstName, lastName, email, phone } = formData.personalInfo;
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
          Alert.alert('Error', 'Please fill in all required personal information fields');
          return false;
        }
        break;
      case 2:
        const { employer, jobTitle } = formData.employmentInfo;
        if (!employer.trim() || !jobTitle.trim()) {
          Alert.alert('Error', 'Please fill in all required employment information fields');
          return false;
        }
        break;
      case 3:
        const { annualIncome, downPayment, loanAmount } = formData;
        if (!annualIncome.trim() || !downPayment.trim() || !loanAmount.trim()) {
          Alert.alert('Error', 'Please fill in all required loan details');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;

    // Here you would typically send the form data to your API
    console.log('Submitting loan application:', formData);
    
    Alert.alert(
      'Application Submitted',
      'Your loan application has been submitted successfully. You will receive updates on your application status.',
      [
        {
          text: 'View Status',
          onPress: () => router.push('/Screens/Buyer/LoanStatus')
        }
      ]
    );
  };

  const renderLoanType = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Loan Type</Text>
      <Text style={styles.stepDescription}>Choose the type of loan application you'd like to submit</Text>
      
      <TouchableOpacity
        style={[
          styles.loanTypeCard,
          formData.loanType === 'pre_approval' && styles.selectedLoanType
        ]}
        onPress={() => handleInputChange('', 'loanType', 'pre_approval')}
      >
        <View style={styles.loanTypeHeader}>
          <Text style={styles.loanTypeIcon}>✅</Text>
          <Text style={styles.loanTypeTitle}>Pre-Approval</Text>
        </View>
        <Text style={styles.loanTypeDescription}>
          Get pre-approved for a loan amount to strengthen your offers when you find the right property.
        </Text>
        <View style={styles.loanTypeBenefits}>
          <Text style={styles.benefitText}>• Know your budget</Text>
          <Text style={styles.benefitText}>• Faster property purchases</Text>
          <Text style={styles.benefitText}>• Stronger negotiating position</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.loanTypeCard,
          formData.loanType === 'specific_property' && styles.selectedLoanType
        ]}
        onPress={() => handleInputChange('', 'loanType', 'specific_property')}
      >
        <View style={styles.loanTypeHeader}>
          <Text style={styles.loanTypeIcon}>🏠</Text>
          <Text style={styles.loanTypeTitle}>Specific Property</Text>
        </View>
        <Text style={styles.loanTypeDescription}>
          Apply for a loan for a specific property you've already identified.
        </Text>
        <View style={styles.loanTypeBenefits}>
          <Text style={styles.benefitText}>• Property-specific terms</Text>
          <Text style={styles.benefitText}>• Detailed property evaluation</Text>
          <Text style={styles.benefitText}>• Final loan approval</Text>
        </View>
      </TouchableOpacity>

      {formData.loanType === 'specific_property' && (
        <View style={styles.propertyDetailsSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Property Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.propertyAddress}
              onChangeText={(value) => handleInputChange('', 'propertyAddress', value)}
              placeholder="Enter property address"
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estimated Property Value *</Text>
            <TextInput
              style={styles.input}
              value={formData.estimatedPropertyValue}
              onChangeText={(value) => handleInputChange('', 'estimatedPropertyValue', value)}
              placeholder="$0"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.personalInfo.firstName}
            onChangeText={(value) => handleInputChange('personalInfo', 'firstName', value)}
            placeholder="Enter first name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.personalInfo.lastName}
            onChangeText={(value) => handleInputChange('personalInfo', 'lastName', value)}
            placeholder="Enter last name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={formData.personalInfo.dateOfBirth}
          onChangeText={(value) => handleInputChange('personalInfo', 'dateOfBirth', value)}
          placeholder="MM/DD/YYYY"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Social Security Number</Text>
        <TextInput
          style={styles.input}
          value={formData.personalInfo.ssn}
          onChangeText={(value) => handleInputChange('personalInfo', 'ssn', value)}
          placeholder="XXX-XX-XXXX"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formData.personalInfo.phone}
          onChangeText={(value) => handleInputChange('personalInfo', 'phone', value)}
          placeholder="(XXX) XXX-XXXX"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.personalInfo.email}
          onChangeText={(value) => handleInputChange('personalInfo', 'email', value)}
          placeholder="Enter email address"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderEmploymentInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Employment Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Employment Status</Text>
        <View style={styles.pickerContainer}>
          {['employed', 'self-employed', 'retired', 'unemployed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.pickerOption,
                formData.employmentStatus === status && styles.selectedOption
              ]}
              onPress={() => handleInputChange('', 'employmentStatus', status)}
            >
              <Text style={[
                styles.pickerOptionText,
                formData.employmentStatus === status && styles.selectedOptionText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Employer</Text>
        <TextInput
          style={styles.input}
          value={formData.employmentInfo.employer}
          onChangeText={(value) => handleInputChange('employmentInfo', 'employer', value)}
          placeholder="Enter employer name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          value={formData.employmentInfo.jobTitle}
          onChangeText={(value) => handleInputChange('employmentInfo', 'jobTitle', value)}
          placeholder="Enter job title"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Years Employed</Text>
          <TextInput
            style={styles.input}
            value={formData.employmentInfo.yearsEmployed}
            onChangeText={(value) => handleInputChange('employmentInfo', 'yearsEmployed', value)}
            placeholder="0"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Monthly Income</Text>
          <TextInput
            style={styles.input}
            value={formData.employmentInfo.monthlyIncome}
            onChangeText={(value) => handleInputChange('employmentInfo', 'monthlyIncome', value)}
            placeholder="$0"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderLoanDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Loan Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Annual Income</Text>
        <TextInput
          style={styles.input}
          value={formData.annualIncome}
          onChangeText={(value) => handleInputChange('', 'annualIncome', value)}
          placeholder="$0"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Credit Score (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.creditScore}
          onChangeText={(value) => handleInputChange('', 'creditScore', value)}
          placeholder="Enter credit score"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Down Payment</Text>
          <TextInput
            style={styles.input}
            value={formData.downPayment}
            onChangeText={(value) => handleInputChange('', 'downPayment', value)}
            placeholder="$0"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Loan Amount</Text>
          <TextInput
            style={styles.input}
            value={formData.loanAmount}
            onChangeText={(value) => handleInputChange('', 'loanAmount', value)}
            placeholder="$0"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Loan Term (Years)</Text>
        <View style={styles.pickerContainer}>
          {['15', '20', '25', '30'].map((term) => (
            <TouchableOpacity
              key={term}
              style={[
                styles.pickerOption,
                formData.loanTerm === term && styles.selectedOption
              ]}
              onPress={() => handleInputChange('', 'loanTerm', term)}
            >
              <Text style={[
                styles.pickerOptionText,
                formData.loanTerm === term && styles.selectedOptionText
              ]}>
                {term} years
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Loan Application</Text>
          <Text style={styles.subtitle}>Step {currentStep} of 4</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              step <= currentStep && styles.activeProgressStep
            ]}
          />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderLoanType()}
        {currentStep === 2 && renderPersonalInfo()}
        {currentStep === 3 && renderEmploymentInfo()}
        {currentStep === 4 && renderLoanDetails()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={currentStep === 4 ? handleSubmit : handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Submit Application' : 'Next'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#1e293b',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  placeholder: {
    width: 40,
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressStep: {
    backgroundColor: '#2563eb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  stepContainer: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pickerOptionText: {
    color: '#64748b',
    fontSize: 14,
  },
  selectedOptionText: {
    color: 'white',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previousButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loanTypeCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedLoanType: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  loanTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  loanTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  loanTypeDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  loanTypeBenefits: {
    marginTop: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  propertyDetailsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
});
