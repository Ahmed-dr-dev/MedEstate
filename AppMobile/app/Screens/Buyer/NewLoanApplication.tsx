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
import { useRouter } from 'expo-router';
import { BuyerBottomNav } from '../../../components/Buyer/BuyerBottomNav';

interface Bank {
  id: string;
  name: string;
  logo: string;
  interestRate: string;
  processingTime: string;
  maxLoanAmount: string;
  rating: number;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

interface LoanApplication {
  id: string;
  propertyTitle: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  expectedResponse: string;
}

export default function NewLoanApplication() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    propertyValue: '',
    downPayment: '',
    loanAmount: '',
    purpose: 'residential',
    propertyType: 'condo',
    propertyAddress: '',
    propertyDescription: '',
    employmentStatus: '',
    annualIncome: '',
    creditScore: ''
  });

  const banks: Bank[] = [
    {
      id: '1',
      name: 'First National Bank',
      logo: '🏦',
      interestRate: '6.2%',
      processingTime: '5-7 days',
      maxLoanAmount: '$2M',
      rating: 4.8,
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      id: '2',
      name: 'Metro Bank',
      logo: '🏛️',
      interestRate: '6.5%',
      processingTime: '7-10 days',
      maxLoanAmount: '$1.5M',
      rating: 4.6,
      isVerified: true,
      verificationStatus: 'verified'
    },
    {
      id: '3',
      name: 'City Bank',
      logo: '🏢',
      interestRate: '6.8%',
      processingTime: '10-14 days',
      maxLoanAmount: '$3M',
      rating: 4.4,
      isVerified: false,
      verificationStatus: 'pending'
    },
    {
      id: '4',
      name: 'Regional Bank',
      logo: '🏪',
      interestRate: '6.0%',
      processingTime: '3-5 days',
      maxLoanAmount: '$1M',
      rating: 4.9,
      isVerified: false,
      verificationStatus: 'unverified'
    }
  ];

  const steps = [
    { id: 1, title: 'Property Details', description: 'Basic property information' },
    { id: 2, title: 'Financial Info', description: 'Income and credit details' },
    { id: 3, title: 'Bank Selection', description: 'Choose your preferred bank' },
    { id: 4, title: 'Review & Submit', description: 'Review and submit application' }
  ];

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return applicationForm.propertyValue && applicationForm.downPayment && applicationForm.loanAmount && applicationForm.propertyAddress;
      case 2:
        return applicationForm.employmentStatus && applicationForm.annualIncome && applicationForm.creditScore;
      case 3:
        return selectedBank !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setShowBankSelection(false);
  };

  const submitApplication = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Success', 
        'Loan application submitted successfully!',
        [
          {
            text: 'View Applications',
            onPress: () => router.push('/Screens/Buyer/LoanApplicationResults')
          },
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
      setIsSubmitting(false);
      // Reset form
      setCurrentStep(1);
      setApplicationForm({
        propertyValue: '',
        downPayment: '',
        loanAmount: '',
        purpose: 'residential',
        propertyType: 'condo',
        propertyAddress: '',
        propertyDescription: '',
        employmentStatus: '',
        annualIncome: '',
        creditScore: ''
      });
      setSelectedBank(null);
    }, 2000);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Property Details</Text>
            <Text style={styles.stepContentSubtitle}>Tell us about the property you want to purchase</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Property Address *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.propertyAddress}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, propertyAddress: text }))}
                placeholder="Enter property address"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Property Value ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={applicationForm.propertyValue}
                  onChangeText={(text) => setApplicationForm(prev => ({ ...prev, propertyValue: text }))}
                  placeholder="Enter property value"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Down Payment ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={applicationForm.downPayment}
                  onChangeText={(text) => setApplicationForm(prev => ({ ...prev, downPayment: text }))}
                  placeholder="Enter down payment"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loan Amount ($) *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.loanAmount}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, loanAmount: text }))}
                placeholder="Enter loan amount"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Financial Information</Text>
            <Text style={styles.stepContentSubtitle}>Help us understand your financial situation</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employment Status *</Text>
              <View style={styles.radioGroup}>
                {['Employed', 'Self-Employed', 'Unemployed', 'Retired'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.radioOption,
                      applicationForm.employmentStatus === status && styles.radioOptionSelected
                    ]}
                    onPress={() => setApplicationForm(prev => ({ ...prev, employmentStatus: status }))}
                  >
                    <Text style={[
                      styles.radioText,
                      applicationForm.employmentStatus === status && styles.radioTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Annual Income ($) *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.annualIncome}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, annualIncome: text }))}
                placeholder="Enter annual income"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Credit Score *</Text>
              <TextInput
                style={styles.input}
                value={applicationForm.creditScore}
                onChangeText={(text) => setApplicationForm(prev => ({ ...prev, creditScore: text }))}
                placeholder="Enter credit score (300-850)"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Choose Your Bank</Text>
            <Text style={styles.stepContentSubtitle}>Select the bank you'd like to apply with</Text>
            
            <TouchableOpacity 
              style={styles.bankSelector}
              onPress={() => setShowBankSelection(true)}
            >
              <Text style={styles.bankSelectorLabel}>Select Bank *</Text>
              <View style={styles.bankSelectorContent}>
                {selectedBank ? (
                  <View style={styles.selectedBank}>
                    <Text style={styles.bankLogo}>{selectedBank.logo}</Text>
                    <View>
                      <Text style={styles.bankName}>{selectedBank.name}</Text>
                      <Text style={styles.bankRate}>{selectedBank.interestRate} • {selectedBank.processingTime}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.bankSelectorPlaceholder}>Choose a bank...</Text>
                )}
                <Text style={styles.bankSelectorArrow}>›</Text>
              </View>
            </TouchableOpacity>

            {selectedBank && (
              <View style={styles.selectedBankCard}>
                <Text style={styles.selectedBankTitle}>Selected Bank</Text>
                <View style={styles.selectedBankInfo}>
                  <Text style={styles.bankLogo}>{selectedBank.logo}</Text>
                  <View style={styles.selectedBankDetails}>
                    <Text style={styles.bankName}>{selectedBank.name}</Text>
                    <Text style={styles.bankRate}>Interest Rate: {selectedBank.interestRate}</Text>
                    <Text style={styles.bankRate}>Processing Time: {selectedBank.processingTime}</Text>
                    <Text style={styles.bankRate}>Max Loan: {selectedBank.maxLoanAmount}</Text>
                    <Text style={styles.bankRating}>⭐ {selectedBank.rating} Rating</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Review Your Application</Text>
            <Text style={styles.stepContentSubtitle}>Please review all information before submitting</Text>
            
            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Property Details</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Address:</Text>
                <Text style={styles.reviewValue}>{applicationForm.propertyAddress}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Property Value:</Text>
                <Text style={styles.reviewValue}>${applicationForm.propertyValue}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Down Payment:</Text>
                <Text style={styles.reviewValue}>${applicationForm.downPayment}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Loan Amount:</Text>
                <Text style={styles.reviewValue}>${applicationForm.loanAmount}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Financial Information</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Employment:</Text>
                <Text style={styles.reviewValue}>{applicationForm.employmentStatus}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Annual Income:</Text>
                <Text style={styles.reviewValue}>${applicationForm.annualIncome}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Credit Score:</Text>
                <Text style={styles.reviewValue}>{applicationForm.creditScore}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Selected Bank</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Bank:</Text>
                <Text style={styles.reviewValue}>{selectedBank?.name}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Interest Rate:</Text>
                <Text style={styles.reviewValue}>{selectedBank?.interestRate}</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f9ff" />
      
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
            <Text style={styles.greeting}>Loan Application</Text>
            <Text style={styles.userName}>Step {currentStep} of {steps.length}</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpIcon}>❓</Text>
          </TouchableOpacity>
        </View>

        {/* Step Tabs */}
        <View style={styles.stepTabs}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepTab,
                currentStep === step.id && styles.stepTabActive
              ]}
              onPress={() => setCurrentStep(step.id)}
            >
              <Text style={[
                styles.stepTabText,
                currentStep === step.id && styles.stepTabTextActive
              ]}>
                {step.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.indicatorContainer}>
              <View style={[
                styles.indicator,
                currentStep >= step.id && styles.indicatorActive,
                currentStep > step.id && styles.indicatorCompleted
              ]}>
                {currentStep > step.id ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={[
                    styles.indicatorNumber,
                    currentStep === step.id && styles.indicatorNumberActive
                  ]}>
                    {step.id}
                  </Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.indicatorLine,
                  currentStep > step.id && styles.indicatorLineActive
                ]} />
              )}
            </View>
          ))}
        </View>

        {/* Step Content */}
        <View style={styles.stepContentContainer}>
          {renderStepContent()}
        </View>

        {/* Continue Button */}
        <View style={styles.continueButtonContainer}>
          {currentStep < 4 ? (
            <TouchableOpacity 
              style={[
                styles.continueButton, 
                !validateStep(currentStep) && styles.continueButtonDisabled
              ]} 
              onPress={nextStep}
              disabled={!validateStep(currentStep)}
            >
              <Text style={[
                styles.continueButtonText,
                !validateStep(currentStep) && styles.continueButtonTextDisabled
              ]}>
                Continue
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                isSubmitting && styles.submitButtonDisabled
              ]} 
              onPress={submitApplication}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bank Selection Modal */}
        {showBankSelection && (
          <View style={styles.bankSelectionOverlay}>
            <View style={styles.bankSelectionCard}>
              <View style={styles.bankSelectionHeader}>
                <Text style={styles.bankSelectionTitle}>Select a Bank</Text>
                <TouchableOpacity onPress={() => setShowBankSelection(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.bankOption}
                  onPress={() => handleBankSelect(bank)}
                >
                  <Text style={styles.bankOptionLogo}>{bank.logo}</Text>
                  <View style={styles.bankOptionInfo}>
                    <View style={styles.bankOptionHeader}>
                      <Text style={styles.bankOptionName}>{bank.name}</Text>
                      <View style={[
                        styles.verificationBadge,
                        { backgroundColor: bank.verificationStatus === 'verified' ? '#dcfce7' : 
                                          bank.verificationStatus === 'pending' ? '#fef3c7' : '#fef2f2' }
                      ]}>
                        <Text style={styles.verificationIcon}>
                          {bank.verificationStatus === 'verified' ? '✅' : 
                           bank.verificationStatus === 'pending' ? '⏳' : '❌'}
                        </Text>
                        <Text style={[
                          styles.verificationText,
                          { color: bank.verificationStatus === 'verified' ? '#16a34a' : 
                                   bank.verificationStatus === 'pending' ? '#d97706' : '#dc2626' }
                        ]}>
                          {bank.verificationStatus === 'verified' ? 'Verified' : 
                           bank.verificationStatus === 'pending' ? 'Pending' : 'Unverified'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.bankOptionDetails}>
                      {bank.interestRate} • {bank.processingTime} • Max: {bank.maxLoanAmount}
                    </Text>
                    <Text style={styles.bankOptionRating}>⭐ {bank.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <BuyerBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
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
    backgroundColor: '#f0f9ff',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helpIcon: {
    fontSize: 20,
  },
  // Step Tabs
  stepTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  stepTabActive: {
    backgroundColor: '#3b82f6',
  },
  stepTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  stepTabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  // Step Indicators
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorActive: {
    backgroundColor: '#3b82f6',
  },
  indicatorCompleted: {
    backgroundColor: '#10b981',
  },
  indicatorNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  indicatorNumberActive: {
    color: 'white',
  },
  checkmark: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  indicatorLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  indicatorLineActive: {
    backgroundColor: '#10b981',
  },
  // Step Content
  stepContentContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  // Continue Button
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#94a3b8',
  },
  // Step Content
  stepContent: {
    marginBottom: 0,
  },
  stepContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  stepContentSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  radioOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  radioText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: 'white',
  },
  bankSelector: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 20,
  },
  bankSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bankSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedBank: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankLogo: {
    fontSize: 24,
    marginRight: 12,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  bankRate: {
    fontSize: 14,
    color: '#64748b',
  },
  bankSelectorPlaceholder: {
    fontSize: 16,
    color: '#94a3b8',
    flex: 1,
  },
  bankSelectorArrow: {
    fontSize: 20,
    color: '#64748b',
  },
  selectedBankCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  selectedBankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  selectedBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBankDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bankRating: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#94a3b8',
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bankSelectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  bankSelectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bankSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    fontSize: 20,
    color: '#64748b',
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  bankOptionLogo: {
    fontSize: 32,
    marginRight: 16,
  },
  bankOptionInfo: {
    flex: 1,
  },
  bankOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bankOptionDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  bankOptionRating: {
    fontSize: 12,
    color: '#f59e0b',
  },
});

