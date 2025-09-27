import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/constants/api';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  property_type?: string;
  owner?: {
    display_name: string;
    phone: string;
  };
}

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

export default function NewLoanApplication() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [showPropertySelection, setShowPropertySelection] = useState(false);
  const [showBankSelection, setShowBankSelection] = useState(false);
  
  // Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  
  // Form data
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [identityCard, setIdentityCard] = useState<string | null>(null);
  const [proofOfIncome, setProofOfIncome] = useState<string | null>(null);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [monthlyInsuranceAmount, setMonthlyInsuranceAmount] = useState('');

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
    }
  ];

  const steps = [
    { id: 1, title: 'Select Property', description: 'Choose from existing properties' },
    { id: 2, title: 'Financial Info', description: 'Income and credit details' },
    { id: 3, title: 'Bank Selection', description: 'Choose your preferred bank' },
    { id: 4, title: 'Insurance', description: 'Property insurance options' },
    { id: 5, title: 'Review & Submit', description: 'Review and submit application' }
  ];

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await fetch(`${API_BASE_URL}/properties`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setProperties(result.data);
      } else {
        console.error('API response error:', result);
        Alert.alert('Error', result.error || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', 'Failed to fetch properties. Please check your connection and try again.');
    } finally {
      setLoadingProperties(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setLoanAmount(property.price.toString());
    setShowPropertySelection(false);
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setShowBankSelection(false);
  };

  const pickImage = async (type: 'identity' | 'income') => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'identity') {
          setIdentityCard(result.assets[0].uri);
        } else {
          setProofOfIncome(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedProperty !== null && loanAmount !== '' && loanTerm !== '';
      case 2:
        return employmentStatus !== '' && annualIncome !== '' && identityCard !== null && proofOfIncome !== null;
      case 3:
        return selectedBank !== null;
      case 4:
        if (includeInsurance) {
          return monthlyInsuranceAmount !== '' && parseFloat(monthlyInsuranceAmount) > 0;
        }
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please log in to submit a loan application');
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate monthly payment
      const loanAmountNum = parseFloat(loanAmount);
      const interestRate = selectedBank ? parseFloat(selectedBank.interestRate.replace('%', '')) : 6.5;
      const loanTermYears = parseInt(loanTerm);
      
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      const monthlyPayment = (loanAmountNum * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      // Prepare documents array
      const submittedDocuments = [];
      if (employmentStatus) {
        submittedDocuments.push(`Employment: ${employmentStatus}`);
      }
      if (identityCard) {
        submittedDocuments.push(`Identity Card: Uploaded`);
      }
      if (proofOfIncome) {
        submittedDocuments.push(`Proof of Income: Uploaded`);
      }
      if (includeInsurance && monthlyInsuranceAmount) {
        submittedDocuments.push(`Insurance: ${monthlyInsuranceAmount} د.ت/month`);
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append('applicant_id', user.id);
      formData.append('property_id', selectedProperty?.id || '');
      formData.append('loan_amount', loanAmountNum.toFixed(2));
      formData.append('loan_term_years', loanTerm);
      formData.append('interest_rate', (interestRate / 100).toFixed(4));
      formData.append('monthly_payment', monthlyPayment.toFixed(2));
      formData.append('employment_status', employmentStatus);
      formData.append('annual_income', annualIncome);
      formData.append('selected_bank_id', selectedBank?.id || '');
      formData.append('include_insurance', includeInsurance.toString());
      if (includeInsurance && monthlyInsuranceAmount) {
        formData.append('monthly_insurance_amount', monthlyInsuranceAmount);
      }

      // Add files if they exist
      if (identityCard) {
        formData.append('identity_card', {
          uri: identityCard,
          type: 'image/jpeg',
          name: 'identity_card.jpg'
        } as any);
      }
      
      if (proofOfIncome) {
        formData.append('proof_of_income', {
          uri: proofOfIncome,
          type: 'image/jpeg',
          name: 'proof_of_income.jpg'
        } as any);
      }

      const response = await fetch(`${API_BASE_URL}/loan-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          'Success', 
          'Loan application submitted successfully!',
          [
            {
              text: 'View Results',
              onPress: () => router.push('/Screens/Buyer/LoanApplicationResults')
            },
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to submit loan application');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      Alert.alert('Error', 'Failed to submit loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Select Property</Text>
            <Text style={styles.stepContentSubtitle}>Choose from existing properties</Text>
            
            <TouchableOpacity 
              style={styles.propertySelector}
              onPress={() => setShowPropertySelection(true)}
            >
              <Text style={styles.propertySelectorLabel}>Select Property *</Text>
              <View style={styles.propertySelectorContent}>
                {selectedProperty ? (
                  <View style={styles.selectedProperty}>
                    <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                    <Text style={styles.propertyLocation}>📍 {selectedProperty.location}</Text>
                    <Text style={styles.propertyPrice}>{selectedProperty.price.toLocaleString()} د.ت</Text>
                  </View>
                ) : (
                  <Text style={styles.propertySelectorPlaceholder}>Choose a property...</Text>
                )}
                <Text style={styles.propertySelectorArrow}>›</Text>
              </View>
            </TouchableOpacity>

            {selectedProperty && (
              <View style={styles.selectedPropertyCard}>
                <Text style={styles.selectedPropertyTitle}>Selected Property</Text>
                <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                <Text style={styles.propertyLocation}>📍 {selectedProperty.location}</Text>
                <Text style={styles.propertyPrice}>{selectedProperty.price.toLocaleString()} د.ت</Text>
                {selectedProperty.bedrooms && selectedProperty.bathrooms && (
                  <Text style={styles.propertyDetails}>
                    {selectedProperty.bedrooms} bed • {selectedProperty.bathrooms} bath
                    {selectedProperty.area && ` • ${selectedProperty.area} sq ft`}
                  </Text>
                )}
                {selectedProperty.property_type && (
                  <Text style={styles.propertyType}>{selectedProperty.property_type}</Text>
                )}
                {selectedProperty.description && (
                  <Text style={styles.propertyDescription}>{selectedProperty.description}</Text>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loan Amount (د.ت) *</Text>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="Enter loan amount"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loan Term *</Text>
              <View style={styles.radioGroup}>
                {['15', '20', '25', '30'].map((term) => (
                  <TouchableOpacity
                    key={term}
                    style={[
                      styles.radioOption,
                      loanTerm === term && styles.radioOptionSelected
                    ]}
                    onPress={() => setLoanTerm(term)}
                  >
                    <Text style={[
                      styles.radioText,
                      loanTerm === term && styles.radioTextSelected
                    ]}>
                      {term} years
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                      employmentStatus === status && styles.radioOptionSelected
                    ]}
                    onPress={() => setEmploymentStatus(status)}
                  >
                    <Text style={[
                      styles.radioText,
                      employmentStatus === status && styles.radioTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Annual Income (د.ت) *</Text>
              <TextInput
                style={styles.input}
                value={annualIncome}
                onChangeText={setAnnualIncome}
                placeholder="Enter annual income"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Personal Identity Card *</Text>
              <TouchableOpacity 
                style={styles.fileUploadButton}
                onPress={() => pickImage('identity')}
              >
                {identityCard ? (
                  <Image source={{ uri: identityCard }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Text style={styles.fileUploadIcon}>📄</Text>
                    <Text style={styles.fileUploadText}>Upload Identity Card</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Proof of Income *</Text>
              <TouchableOpacity 
                style={styles.fileUploadButton}
                onPress={() => pickImage('income')}
              >
                {proofOfIncome ? (
                  <Image source={{ uri: proofOfIncome }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Text style={styles.fileUploadIcon}>💰</Text>
                    <Text style={styles.fileUploadText}>Upload Proof of Income</Text>
                  </>
                )}
              </TouchableOpacity>
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
                onPress={() => setIncludeInsurance(!includeInsurance)}
              >
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Include Property Insurance</Text>
                  <View style={[styles.toggleSwitch, includeInsurance && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, includeInsurance && styles.toggleThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {includeInsurance && (
              <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Monthly Insurance Payment (د.ت)</Text>
                <TextInput
                  style={styles.input}
                  value={monthlyInsuranceAmount}
                  onChangeText={setMonthlyInsuranceAmount}
                  placeholder="Enter monthly insurance amount"
                  keyboardType="numeric"
                  placeholderTextColor="#64748b"
                />
                <Text style={styles.insuranceNote}>
                  This amount will be added to your monthly loan payment to protect your property against damage.
                </Text>
              </View>
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
                <Text style={styles.reviewLabel}>Property:</Text>
                <Text style={styles.reviewValue}>{selectedProperty?.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Address:</Text>
                <Text style={styles.reviewValue}>{selectedProperty?.location}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Property Value:</Text>
                 <Text style={styles.reviewValue}>{selectedProperty?.price.toLocaleString()} د.ت</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Loan Amount:</Text>
                <Text style={styles.reviewValue}>{loanAmount} د.ت</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Loan Term:</Text>
                <Text style={styles.reviewValue}>{loanTerm} years</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Financial Information</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Employment:</Text>
                <Text style={styles.reviewValue}>{employmentStatus}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Annual Income:</Text>
                <Text style={styles.reviewValue}>{annualIncome} د.ت</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Identity Card:</Text>
                <View style={styles.reviewImageContainer}>
                  {identityCard ? (
                    <Image source={{ uri: identityCard }} style={styles.reviewImage} />
                  ) : (
                    <Text style={styles.reviewValue}>Not uploaded</Text>
                  )}
                </View>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Proof of Income:</Text>
                <View style={styles.reviewImageContainer}>
                  {proofOfIncome ? (
                    <Image source={{ uri: proofOfIncome }} style={styles.reviewImage} />
                  ) : (
                    <Text style={styles.reviewValue}>Not uploaded</Text>
                  )}
                </View>
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

            {includeInsurance && (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewSectionTitle}>Insurance Information</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Monthly Insurance:</Text>
                   <Text style={styles.reviewValue}>{monthlyInsuranceAmount} د.ت</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Annual Insurance:</Text>
                   <Text style={styles.reviewValue}>{monthlyInsuranceAmount ? (parseFloat(monthlyInsuranceAmount) * 12).toFixed(0) : '0'} د.ت</Text>
                </View>
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

        {/* Progress */}
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
        </View>

        {/* Step Content */}
        <View style={styles.stepContentContainer}>
          {renderStepContent()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.continueButtonContainer}>
          {currentStep > 1 && currentStep < 5 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={prevStep}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              currentStep === 5 ? styles.submitButton : styles.continueButton,
              (!validateStep(currentStep) && currentStep < 4) && styles.continueButtonDisabled,
              isSubmitting && styles.submitButtonDisabled,
              currentStep === 1 && styles.fullWidthButton
            ]} 
            onPress={currentStep === 5 ? submitApplication : nextStep}
            disabled={(!validateStep(currentStep) && currentStep < 4) || isSubmitting}
          >
            <Text style={[
              currentStep === 5 ? styles.submitButtonText : styles.continueButtonText,
              (!validateStep(currentStep) && currentStep < 4) && styles.continueButtonTextDisabled
            ]}>
              {currentStep === 5 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Property Selection Modal */}
      {showPropertySelection && (
        <View style={styles.propertySelectionOverlay}>
          <View style={styles.propertySelectionCard}>
            <View style={styles.propertySelectionHeader}>
              <Text style={styles.propertySelectionTitle}>Select a Property</Text>
              <TouchableOpacity onPress={() => setShowPropertySelection(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {loadingProperties ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading properties...</Text>
              </View>
            ) : properties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Properties Available</Text>
                <Text style={styles.emptySubtitle}>No properties found. Please try again later.</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchProperties}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              properties.map((property: Property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.propertyOption}
                  onPress={() => handlePropertySelect(property)}
                >
                  <View style={styles.propertyImageContainer}>
                    {property.images && property.images.length > 0 ? (
                      <Image 
                        source={{ uri: property.images[0] }} 
                        style={styles.propertyImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.propertyImagePlaceholder}>🏠</Text>
                    )}
                  </View>
                  <View style={styles.propertyOptionInfo}>
                    <Text style={styles.propertyOptionTitle}>{property.title}</Text>
                    <Text style={styles.propertyOptionLocation}>📍 {property.location}</Text>
                    <Text style={styles.propertyOptionPrice}>{property.price.toLocaleString()} د.ت</Text>
                    {property.bedrooms && property.bathrooms && (
                      <Text style={styles.propertyOptionDetails}>
                        {property.bedrooms} bed • {property.bathrooms} bath
                        {property.area && ` • ${property.area} sq ft`}
                      </Text>
                    )}
                    {property.property_type && (
                      <Text style={styles.propertyOptionType}>{property.property_type}</Text>
                    )}
                    {property.description && (
                      <Text style={styles.propertyOptionDescription} numberOfLines={2}>
                        {property.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      )}

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
  progressContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
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
  stepContentContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
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
  fileUploadButton: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#64748b',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileUploadIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fileUploadText: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  uploadedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  reviewImageContainer: {
    alignItems: 'flex-end',
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    backgroundColor: '#475569',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#64748b',
    flex: 1,
  },
  backButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
  },
  continueButtonDisabled: {
    backgroundColor: '#475569',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
  },
  submitButtonDisabled: {
    backgroundColor: '#475569',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Property Selection Styles
  propertySelector: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#64748b',
    marginBottom: 20,
  },
  propertySelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  propertySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedProperty: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  propertyDescription: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
  },
  propertyDetails: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  propertyType: {
    fontSize: 12,
    color: '#0ea5e9',
    marginTop: 2,
    fontWeight: '500',
  },
  propertySelectorPlaceholder: {
    fontSize: 16,
    color: '#64748b',
    flex: 1,
  },
  propertySelectorArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  selectedPropertyCard: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  selectedPropertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  propertySelectionOverlay: {
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
  propertySelectionCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  propertySelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  propertySelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
  },
  closeButton: {
    fontSize: 20,
    color: '#94a3b8',
  },
  propertyOption: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#64748b',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  propertyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyImagePlaceholder: {
    fontSize: 24,
  },
  propertyOptionInfo: {
    flex: 1,
  },
  propertyOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  propertyOptionLocation: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  propertyOptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  propertyOptionDescription: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
  },
  propertyOptionDetails: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  propertyOptionType: {
    fontSize: 12,
    color: '#0ea5e9',
    marginTop: 2,
    fontWeight: '500',
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Bank Selection Styles
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
  insuranceNote: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Review Styles
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
});