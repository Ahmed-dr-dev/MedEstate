import React, { useState, useEffect, useMemo } from 'react';
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
  images?: any[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  property_type?: string;
  owner?: {
    display_name: string;
    phone: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Mock data for Dubai developer houses (Acube promotion)
const dubaiDeveloperHouses: Property[] = [
  {
    id: 'dubai-1',
    title: 'Luxury Villa in Palm Jumeirah',
    description: 'Stunning waterfront villa with private beach access and panoramic views of the Arabian Gulf.',
    price: 8500000,
    location: 'Palm Jumeirah, Dubai, UAE',
    bedrooms: 6,
    bathrooms: 7,
    area: 8500,
    property_type: 'Villa',
    images: [
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dubai-2',
    title: 'Modern Apartment in Downtown Dubai',
    description: 'Contemporary apartment in the heart of Dubai with Burj Khalifa views and premium amenities.',
    price: 3200000,
    location: 'Downtown Dubai, UAE',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    property_type: 'Apartment',
    images: [
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dubai-3',
    title: 'Penthouse in Marina Walk',
    description: 'Exclusive penthouse with private terrace overlooking Dubai Marina and the Arabian Gulf.',
    price: 12000000,
    location: 'Dubai Marina, UAE',
    bedrooms: 4,
    bathrooms: 5,
    area: 4500,
    property_type: 'Penthouse',
    images: [
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Mock data for Anga Esghaier developer houses (Esghaier Immobilière promotion)
const esgaiherTunisiaHouses: Property[] = [
  {
    id: 'esgaiher-1',
    title: 'Villa Moderne à Sidi Bou Saïd',
    description: 'Villa contemporaine avec vue sur la mer Méditerranée et architecture traditionnelle tunisienne.',
    price: 450000,
    location: 'Sidi Bou Saïd, Tunis, Tunisie',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    property_type: 'Villa',
    images: [
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-2',
    title: 'Appartement de Luxe à Carthage',
    description: 'Appartement haut de gamme dans le quartier historique de Carthage avec vue sur les ruines antiques.',
    price: 320000,
    location: 'Carthage, Tunis, Tunisie',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    property_type: 'Apartment',
    images: [
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-3',
    title: 'Villa Familiale à La Marsa',
    description: 'Villa spacieuse pour famille avec jardin privé et piscine, proche des plages de La Marsa.',
    price: 680000,
    location: 'La Marsa, Tunis, Tunisie',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    property_type: 'Villa',
    images: [
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-4',
    title: 'Studio Moderne à Tunis Centre',
    description: 'Studio moderne et fonctionnel au cœur de Tunis, idéal pour investissement locatif.',
    price: 85000,
    location: 'Tunis Centre, Tunisie',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    property_type: 'Studio',
      images: [
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

interface Bank {
  id: string;
  name: string;
  logo: any;
  description: string;
}

export default function NewLoanApplication() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPropertySelection, setShowPropertySelection] = useState(false);
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState('dubai'); // 'dubai', 'esgaiher'
  
  // Get properties based on selected developer
  const properties = useMemo(() => {
    return selectedDeveloper === 'dubai' ? dubaiDeveloperHouses : esgaiherTunisiaHouses;
  }, [selectedDeveloper]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [banks] = useState<Bank[]>([
    { 
      id: '1', 
      name: 'Banque de Tunisie', 
      logo: require('../../logos/Bank_of_Tunisia_logo.gif'), 
      description: 'Leading commercial bank in Tunisia' 
    },
    { 
      id: '2', 
      name: 'Banque Internationale Arabe de Tunisie (BIAT)', 
      logo: require('../../logos/biat.jpg'), 
      description: 'Major private bank in Tunisia' 
    },
    { 
      id: '3', 
      name: 'Banque de l\'Habitat (BH)', 
      logo: require('../../logos/bh.png'), 
      description: 'Housing bank of Tunisia' 
    },
    { 
      id: '4', 
      name: 'Attijari Bank', 
      logo: require('../../logos/attijari.png'), 
      description: 'Moroccan bank in Tunisia' 
    },
    { 
      id: '5', 
      name: 'Banque Zitouna', 
      logo: require('../../logos/zitouna.png'), 
      description: 'Islamic bank in Tunisia' 
    },
    { 
      id: '6', 
      name: 'Banque Nationale Agricole (BNA)', 
      logo: require('../../logos/bna.png'), 
      description: 'National agricultural bank' 
    },
    { 
      id: '7', 
      name: 'Qatar National Bank (QNB)', 
      logo: require('../../logos/qnb.png'), 
      description: 'Qatari bank in Tunisia' 
    },
    { 
      id: '8', 
      name: 'Arab Tunisian Bank (ATB)', 
      logo: require('../../logos/atb.png'), 
      description: 'Arab Tunisian banking group' 
    }
  ]);
  
  // Form data - standardized object
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanTerm: '',
    employmentStatus: '',
    annualIncome: '',
    identityCard: null as string | null,
    proofOfIncome: null as string | null,
    includeInsurance: false,
    monthlyInsuranceAmount: ''
  });


  const steps = [
    { id: 1, title: 'Select Property', description: 'Choose from existing properties' },
    { id: 2, title: 'Financial Info', description: 'Income and credit details' },
    { id: 3, title: 'Bank Selection', description: 'Choose your preferred bank' },
    { id: 4, title: 'Insurance', description: 'Property insurance options' },
    { id: 5, title: 'Review & Submit', description: 'Review and submit application' }
  ];

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setFormData(prev => ({ ...prev, loanAmount: property.price.toString() }));
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
          setFormData(prev => ({ ...prev, identityCard: result.assets[0].uri }));
        } else {
          setFormData(prev => ({ ...prev, proofOfIncome: result.assets[0].uri }));
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
        return selectedProperty !== null && formData.loanAmount !== '' && formData.loanTerm !== '';
      case 2:
        return formData.employmentStatus !== '' && formData.annualIncome !== '' && formData.identityCard !== null && formData.proofOfIncome !== null;
      case 3:
        return selectedBank !== null;
      case 4:
        if (formData.includeInsurance) {
          return formData.monthlyInsuranceAmount !== '' && parseFloat(formData.monthlyInsuranceAmount) > 0;
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
      const loanAmountNum = parseFloat(formData.loanAmount);
      const interestRate = 6.5; // Default interest rate since we're using bank agents
      const loanTermYears = parseInt(formData.loanTerm);
      
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      const monthlyPayment = (loanAmountNum * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      // Prepare documents array
      const submittedDocuments = [];
      if (formData.employmentStatus) {
        submittedDocuments.push(`Employment: ${formData.employmentStatus}`);
      }
      if (formData.identityCard) {
        submittedDocuments.push(`Identity Card: Uploaded`);
      }
      if (formData.proofOfIncome) {
        submittedDocuments.push(`Proof of Income: Uploaded`);
      }
      if (formData.includeInsurance && formData.monthlyInsuranceAmount) {
        submittedDocuments.push(`Insurance: ${formData.monthlyInsuranceAmount} د.ت/month`);
      }

      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add all form fields
      submitFormData.append('applicant_id', user.id);
      submitFormData.append('property_id', selectedProperty?.id || '');
      submitFormData.append('loan_amount', loanAmountNum.toFixed(2));
      submitFormData.append('loan_term_years', formData.loanTerm);
      submitFormData.append('interest_rate', (interestRate / 100).toFixed(4));
      submitFormData.append('monthly_payment', monthlyPayment.toFixed(2));
      submitFormData.append('employment_status', formData.employmentStatus);
      submitFormData.append('annual_income', formData.annualIncome);
      submitFormData.append('bank_agent_id', 'default-bank-agent-id'); // All applications go to same bank agent
      submitFormData.append('include_insurance', formData.includeInsurance.toString());
      if (formData.includeInsurance && formData.monthlyInsuranceAmount) {
        submitFormData.append('monthly_insurance_amount', formData.monthlyInsuranceAmount);
      }

      // Add files if they exist
      if (formData.identityCard) {
        submitFormData.append('identity_card', {
          uri: formData.identityCard,
          type: 'image/jpeg',
          name: 'identity_card.jpg'
        } as any);
      }
      
      if (formData.proofOfIncome) {
        submitFormData.append('proof_of_income', {
          uri: formData.proofOfIncome,
          type: 'image/jpeg',
          name: 'proof_of_income.jpg'
        } as any);
      }
console.log(submitFormData);
      const response = await fetch(`${API_BASE_URL}/loan-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: submitFormData
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
            <Text style={styles.stepContentSubtitle}>Choose from developer properties</Text>
            
            {/* Developer Selection */}
            <View style={styles.developerSelection}>
              <Text style={styles.developerLabel}>Select Developer</Text>
              <View style={styles.developerButtons}>
                <TouchableOpacity
                  style={[
                    styles.developerButton,
                    selectedDeveloper === 'dubai' && styles.developerButtonActive
                  ]}
                  onPress={() => setSelectedDeveloper('dubai')}
                >
                  <Text style={[
                    styles.developerButtonText,
                    selectedDeveloper === 'dubai' && styles.developerButtonTextActive
                  ]}>
                    🇦🇪 Dubai Properties
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.developerButton,
                    selectedDeveloper === 'esgaiher' && styles.developerButtonActive
                  ]}
                  onPress={() => setSelectedDeveloper('esgaiher')}
                >
                  <Text style={[
                    styles.developerButtonText,
                    selectedDeveloper === 'esgaiher' && styles.developerButtonTextActive
                  ]}>
                    🇹🇳 Esgaiher Tunisia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
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
                value={formData.loanAmount}
                onChangeText={(value) => setFormData(prev => ({ ...prev, loanAmount: value }))}
                placeholder="Enter loan amount"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loan Term (Years) *</Text>
              <TextInput
                style={styles.input}
                value={formData.loanTerm}
                onChangeText={(value) => setFormData(prev => ({ ...prev, loanTerm: value }))}
                placeholder="Enter loan term (e.g., 15, 20, 25, 30)"
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
                      formData.employmentStatus === status && styles.radioOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, employmentStatus: status }))}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.employmentStatus === status && styles.radioTextSelected
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
                value={formData.annualIncome}
                onChangeText={(value) => setFormData(prev => ({ ...prev, annualIncome: value }))}
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
                {formData.identityCard ? (
                  <Image source={{ uri: formData.identityCard }} style={styles.uploadedImage} />
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
                {formData.proofOfIncome ? (
                  <Image source={{ uri: formData.proofOfIncome }} style={styles.uploadedImage} />
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
            <Text style={styles.stepContentSubtitle}>Select your preferred Tunisian bank</Text>
            
            <TouchableOpacity 
              style={styles.bankSelector}
              onPress={() => setShowBankSelection(true)}
            >
              <Text style={styles.bankSelectorLabel}>Select Bank *</Text>
              <View style={styles.bankSelectorContent}>
                {selectedBank ? (
                  <View style={styles.selectedBank}>
                    <Image source={selectedBank.logo} style={styles.bankLogoImageSmall} />
                    <View>
                      <Text style={styles.bankName}>{selectedBank.name}</Text>
                      <Text style={styles.bankRate}>{selectedBank.description}</Text>
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
                  <Image source={selectedBank.logo} style={styles.bankLogoImage} />
                  <View style={styles.selectedBankDetails}>
                    <Text style={styles.bankName}>{selectedBank.name}</Text>
                    <Text style={styles.bankRate}>{selectedBank.description}</Text>
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
                onPress={() => setFormData(prev => ({ ...prev, includeInsurance: !prev.includeInsurance }))}
              >
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Include Property Insurance</Text>
                  <View style={[styles.toggleSwitch, formData.includeInsurance && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, formData.includeInsurance && styles.toggleThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {formData.includeInsurance && (
              <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Monthly Insurance Payment (د.ت)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.monthlyInsuranceAmount}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, monthlyInsuranceAmount: value }))}
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
                <Text style={styles.reviewValue}>{formData.loanAmount} د.ت</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Loan Term:</Text>
                <Text style={styles.reviewValue}>{formData.loanTerm} years</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSectionTitle}>Financial Information</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Employment:</Text>
                <Text style={styles.reviewValue}>{formData.employmentStatus}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Annual Income:</Text>
                <Text style={styles.reviewValue}>{formData.annualIncome} د.ت</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Identity Card:</Text>
                <View style={styles.reviewImageContainer}>
                  {formData.identityCard ? (
                    <Image source={{ uri: formData.identityCard }} style={styles.reviewImage} />
                  ) : (
                    <Text style={styles.reviewValue}>Not uploaded</Text>
                  )}
                </View>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Proof of Income:</Text>
                <View style={styles.reviewImageContainer}>
                  {formData.proofOfIncome ? (
                    <Image source={{ uri: formData.proofOfIncome }} style={styles.reviewImage} />
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
                <Text style={styles.reviewLabel}>Description:</Text>
                <Text style={styles.reviewValue}>{selectedBank?.description}</Text>
              </View>
            </View>

            {formData.includeInsurance && (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewSectionTitle}>Insurance Information</Text>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Monthly Insurance:</Text>
                   <Text style={styles.reviewValue}>{formData.monthlyInsuranceAmount} د.ت</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Annual Insurance:</Text>
                   <Text style={styles.reviewValue}>{formData.monthlyInsuranceAmount ? (parseFloat(formData.monthlyInsuranceAmount) * 12).toFixed(0) : '0'} د.ت</Text>
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
            
            {properties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Properties Available</Text>
                <Text style={styles.emptySubtitle}>Please select a developer to view properties.</Text>
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
                        source={property.images[0]} 
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
            
            <ScrollView style={styles.bankListContainer} showsVerticalScrollIndicator={false}>
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.bankOption}
                  onPress={() => handleBankSelect(bank)}
                >
                  <Image source={bank.logo} style={styles.bankOptionLogo} />
                  <View style={styles.bankOptionInfo}>
                    <View style={styles.bankOptionHeader}>
                      <Text style={styles.bankOptionName}>{bank.name}</Text>
                      <View style={[styles.verificationBadge, { backgroundColor: '#dcfce7' }]}>
                        <Text style={styles.verificationIcon}>✅</Text>
                        <Text style={[styles.verificationText, { color: '#16a34a' }]}>
                          Available
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.bankOptionDetails}>{bank.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  bankLogoImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8fafc',
  },
  bankLogoImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#f8fafc',
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
    maxHeight: '85%',
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64748b',
    marginBottom: 12,
    backgroundColor: '#475569',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bankOptionLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f8fafc',
  },
  bankListContainer: {
    maxHeight: 400,
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
  loadingContainerBank: {
    padding: 20,
    alignItems: 'center',
  },
  loadingTextBank: {
    fontSize: 16,
    color: '#94a3b8',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  // Developer Selection Styles
  developerSelection: {
    marginBottom: 24,
  },
  developerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  developerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  developerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64748b',
    backgroundColor: '#475569',
    alignItems: 'center',
  },
  developerButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  developerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  developerButtonTextActive: {
    color: 'white',
  },
});