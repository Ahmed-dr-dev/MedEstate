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
    creditScore: '',
    includeInsurance: false,
    insuranceType: 'homeowners',
    insuranceAmount: '',
    insuranceProvider: ''
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
    { id: 4, title: 'Insurance', description: 'Property insurance options' },
    { id: 5, title: 'Review & Submit', description: 'Review and submit application' }
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
        return true; // Insurance is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
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
        creditScore: '',
        includeInsurance: false,
        insuranceType: 'homeowners',
        insuranceAmount: '',
        insuranceProvider: ''
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
            <Text style={styles.stepContentTitle}>Property Insurance</Text>
            <Text style={styles.stepContentSubtitle}>Protect your investment with property insurance</Text>
            
            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.insuranceToggle}
                onPress={() => setApplicationForm(prev => ({ ...prev, includeInsurance: !prev.includeInsurance }))}
              >
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Include Property Insurance</Text>
                  <View style={[styles.toggleSwitch, applicationForm.includeInsurance && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, applicationForm.includeInsurance && styles.toggleThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {applicationForm.includeInsurance && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Insurance Type</Text>
                  <View style={styles.insuranceTypeContainer}>
                    {[
                      { id: 'homeowners', label: 'Homeowners Insurance', description: 'Comprehensive coverage' },
                      { id: 'condo', label: 'Condo Insurance', description: 'For condominiums' },
                      { id: 'renters', label: 'Renters Insurance', description: 'Personal property coverage' }
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.insuranceTypeOption,
                          applicationForm.insuranceType === type.id && styles.insuranceTypeOptionSelected
                        ]}
                        onPress={() => setApplicationForm(prev => ({ ...prev, insuranceType: type.id }))}
                      >
                        <Text style={[
                          styles.insuranceTypeLabel,
                          applicationForm.insuranceType === type.id && styles.insuranceTypeLabelSelected
                        ]}>
                          {type.label}
                        </Text>
                        <Text style={[
                          styles.insuranceTypeDescription,
                          applicationForm.insuranceType === type.id && styles.insuranceTypeDescriptionSelected
                        ]}>
                          {type.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Annual Insurance Premium ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={applicationForm.insuranceAmount}
                    onChangeText={(text) => setApplicationForm(prev => ({ ...prev, insuranceAmount: text }))}
                    placeholder="Enter annual premium"
                    keyboardType="numeric"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Insurance Provider</Text>
                  <TextInput
                    style={styles.input}
                    value={applicationForm.insuranceProvider}
                    onChangeText={(text) => setApplicationForm(prev => ({ ...prev, insuranceProvider: text }))}
                    placeholder="Enter insurance company name"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.insuranceInfo}>
                  <Text style={styles.insuranceInfoTitle}>🛡️ Why Property Insurance?</Text>
                  <Text style={styles.insuranceInfoText}>
                    • Protects your property from damage (fire, storms, theft)
                    • Covers liability if someone is injured on your property
                    • Required by most lenders for mortgage approval
                    • Provides peace of mind for your investment
                  </Text>
                </View>
              </>
            )}
          </View>
        );

      case 5:
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

            {applicationForm.includeInsurance && (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewSectionTitle}>Insurance Information</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Insurance Type:</Text>
                  <Text style={styles.reviewValue}>{applicationForm.insuranceType.charAt(0).toUpperCase() + applicationForm.insuranceType.slice(1)} Insurance</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Annual Premium:</Text>
                  <Text style={styles.reviewValue}>${applicationForm.insuranceAmount}</Text>
                </View>
                {applicationForm.insuranceProvider && (
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Provider:</Text>
                    <Text style={styles.reviewValue}>{applicationForm.insuranceProvider}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

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
          <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
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

        {/* Compact Step Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Step {currentStep} of {steps.length}</Text>
            <Text style={styles.progressSubtitle}>{steps[currentStep - 1]?.title}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentStep / steps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round((currentStep / steps.length) * 100)}%
            </Text>
          </View>
          
          <View style={styles.stepDots}>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.stepDotContainer}>
                <View style={[
                  styles.stepDot,
                  currentStep >= step.id && styles.stepDotActive,
                  currentStep > step.id && styles.stepDotCompleted
                ]}>
                  {currentStep > step.id ? (
                    <Text style={styles.stepDotCheckmark}>✓</Text>
                  ) : (
                    <Text style={[
                      styles.stepDotNumber,
                      currentStep === step.id && styles.stepDotNumberActive
                    ]}>
                      {step.id}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepDotLabel,
                  currentStep === step.id && styles.stepDotLabelActive
                ]}>
                  {step.title.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>
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
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helpIcon: {
    fontSize: 20,
  },
  // Compact Progress Design
  progressContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#475569',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0ea5e9',
    minWidth: 35,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepDotContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: '#0ea5e9',
  },
  stepDotCompleted: {
    backgroundColor: '#10b981',
  },
  stepDotNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stepDotNumberActive: {
    color: 'white',
  },
  stepDotCheckmark: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  stepDotLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepDotLabelActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  // Step Content
  stepContentContainer: {
    backgroundColor: '#334155',
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
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#64748b',
  },
  // Step Content
  stepContent: {
    marginBottom: 0,
  },
  stepContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  stepContentSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
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
    color: '#e2e8f0',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#64748b',
    color: '#f8fafc',
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
    borderColor: '#64748b',
    backgroundColor: '#475569',
  },
  radioOptionSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  radioText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: 'white',
  },
  bankSelector: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#64748b',
    marginBottom: 20,
  },
  bankSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
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
    color: '#f8fafc',
  },
  bankRate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  bankSelectorPlaceholder: {
    fontSize: 16,
    color: '#64748b',
    flex: 1,
  },
  bankSelectorArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  selectedBankCard: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  selectedBankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
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
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#64748b',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
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
    color: '#94a3b8',
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 14,
    color: '#f8fafc',
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
    backgroundColor: '#334155',
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
    color: '#f8fafc',
  },
  closeButton: {
    fontSize: 20,
    color: '#94a3b8',
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64748b',
    marginBottom: 12,
    backgroundColor: '#475569',
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
    color: '#f8fafc',
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
    color: '#94a3b8',
    marginBottom: 4,
  },
  bankOptionRating: {
    fontSize: 12,
    color: '#f59e0b',
  },
  // Insurance Styles
  insuranceToggle: {
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#475569',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#0ea5e9',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f8fafc',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  insuranceTypeContainer: {
    gap: 12,
  },
  insuranceTypeOption: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#64748b',
  },
  insuranceTypeOptionSelected: {
    backgroundColor: '#334155',
    borderColor: '#0ea5e9',
  },
  insuranceTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  insuranceTypeLabelSelected: {
    color: '#f8fafc',
  },
  insuranceTypeDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  insuranceTypeDescriptionSelected: {
    color: '#e2e8f0',
  },
  insuranceInfo: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  insuranceInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  insuranceInfoText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});

