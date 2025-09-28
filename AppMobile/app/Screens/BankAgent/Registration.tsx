import React, { useState, useRef, useEffect } from 'react';
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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL } from '../../../constants/api';
const { width, height } = Dimensions.get('window');

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: number;
  phone: string;
  address: string;
  city: string;
  postalCode: number;
}

interface BankInfo {
  bankName: string;
  position: string;
  employeeId: number;
  department: string;
  workAddress: string;
  supervisorName: string;
  supervisorPhone: string;
}

interface Documents {
  nationalIdDocument: string;
  bankEmploymentLetter: string;
}

export default function BankAgentRegistration() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationalId: 0,
    phone: '',
    address: '',
    city: '',
    postalCode: 0,
  });

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: '',
    position: '',
    employeeId: 0,
    department: '',
    workAddress: '',
    supervisorName: '',
    supervisorPhone: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    nationalIdDocument: '',
    bankEmploymentLetter: '',
  });

  // Check if user already has a registration
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (!user?.id) {
        setIsCheckingRegistration(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/bank-agent-registration?user_id=${user.id}`);
        const result = await response.json();
    
        if (result.success && result.registrations && result.registrations.length > 0) {
          // User already has a registration, redirect to dashboard
          router.replace('/Screens/BankAgent/Dashboard');
        } else {
          // No existing registration, allow form access
          setIsCheckingRegistration(false);
        }
      } catch (error) {
        console.error('Error checking existing registration:', error);
        // If check fails, allow form access
        setIsCheckingRegistration(false);
      }
    };

    checkExistingRegistration();
  }, [user?.id, router]);

  const pickImage = async (documentType: 'nationalIdDocument' | 'bankEmploymentLetter') => {
    try {
      // Request camera permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos of documents.');
        return;
      }

      // Show action sheet for camera or gallery
      Alert.alert(
        'Select Image Source',
        'Choose how you want to add the document image',
        [
          {
            text: 'Camera',
            onPress: () => openCamera(documentType),
          },
          {
            text: 'Gallery',
            onPress: () => openGallery(documentType),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions.');
    }
  };

  const openCamera = async (documentType: 'nationalIdDocument' | 'bankEmploymentLetter') => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setDocuments({
          ...documents,
          [documentType]: result.assets[0].uri,
        });
        Alert.alert('Success', 'Document photo captured successfully!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const openGallery = async (documentType: 'nationalIdDocument' | 'bankEmploymentLetter') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setDocuments({
          ...documents,
          [documentType]: result.assets[0].uri,
        });
        Alert.alert('Success', 'Document photo selected successfully!');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

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
    // Check if all required fields are filled
    const basicValidation = personalInfo.firstName.trim() !== '' &&
                           personalInfo.lastName.trim() !== '' &&
                           personalInfo.nationalId > 0 &&
                           personalInfo.phone.trim() !== '' &&
                           personalInfo.address.trim() !== '' &&
                           personalInfo.city.trim() !== '' &&
                           personalInfo.dateOfBirth.trim() !== '';
    
    if (!basicValidation) {
      return false;
    }
    
    // Validate Tunisian formats
    const nationalIdValid = /^[0-9]{8}$/.test(personalInfo.nationalId.toString());
    const phoneValid = /^[0-9]{8}$/.test(personalInfo.phone);
    const postalCodeValid = personalInfo.postalCode === 0 || /^[0-9]{4}$/.test(personalInfo.postalCode.toString());
    
    if (!nationalIdValid || !phoneValid || !postalCodeValid) {
      return false;
    }
    
    // Validate date format and age
    try {
      // Parse DD/MM/YYYY format
      const dateParts = personalInfo.dateOfBirth.split('/');
      if (dateParts.length !== 3) {
        return false;
      }
      
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const year = parseInt(dateParts[2]);
      
      const birthDate = new Date(year, month, day);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        return false;
      }
      
      // Calculate age
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isOver20 = age > 20 || (age === 20 && monthDiff >= 0 && today.getDate() >= birthDate.getDate());
      
      return isOver20;
    } catch (error) {
      return false;
    }
  };

  const validateBankInfo = () => {
    return bankInfo.bankName.trim() !== '' &&
           bankInfo.position.trim() !== '' &&
           bankInfo.employeeId > 0 &&
           /^[0-9]{6}$/.test(bankInfo.employeeId.toString()) &&
           bankInfo.department.trim() !== '' &&
           bankInfo.supervisorPhone.trim() !== '' &&
           /^[0-9]{8}$/.test(bankInfo.supervisorPhone);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated. Please sign in again.');
        return;
      }

      // Prepare form data for API
      const formData = new FormData();
      
      // Add JSON data as strings
      formData.append('personalInfo', JSON.stringify({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        dateOfBirth: personalInfo.dateOfBirth,
        nationalId: personalInfo.nationalId,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        postalCode: personalInfo.postalCode,
      }));
      
      formData.append('bankInfo', JSON.stringify({
        bankName: bankInfo.bankName,
        position: bankInfo.position,
        employeeId: bankInfo.employeeId,
        department: bankInfo.department,
        workAddress: bankInfo.workAddress,
        supervisorName: bankInfo.supervisorName,
        supervisorPhone: bankInfo.supervisorPhone,
      }));
      
      formData.append('userId', user.id);

      // Add document files if they exist
      if (documents.nationalIdDocument) {
        formData.append('national_id_document', {
          uri: documents.nationalIdDocument,
          type: 'image/jpeg',
          name: 'national_id_document.jpg',
        } as any);
      }

      if (documents.bankEmploymentLetter) {
        formData.append('bank_employment_letter', {
          uri: documents.bankEmploymentLetter,
          type: 'image/png',
          name: 'bank_employment_letter.png',
        } as any);
      }

      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/bank-agent-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit registration');
      }
      
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
    } catch (error) {
      console.error('Registration submission error:', error);
      Alert.alert(
        'Submission Failed',
        error instanceof Error ? error.message : 'Failed to submit registration. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
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
        <Text style={styles.label}>Date of Birth *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.dateOfBirth}
          onChangeText={(text) => {
            // Auto-format date with / separators
            let formatted = text.replace(/\D/g, ''); // Remove non-digits
            if (formatted.length >= 2) {
              formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
            }
            if (formatted.length >= 5) {
              formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
            }
            setPersonalInfo({...personalInfo, dateOfBirth: formatted});
          }}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#94a3b8"
          autoCorrect={false}
          editable={true}
          maxLength={10}
          keyboardType="numeric"
        />
        <Text style={styles.ageNote}>Must be 20 years or older (Format: DD/MM/YYYY)</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>National ID *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.nationalId.toString()}
          onChangeText={(text) => setPersonalInfo({...personalInfo, nationalId: parseInt(text) || 0})}
          placeholder="12345678"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          maxLength={8}
          autoCorrect={false}
          editable={true}
        />
        <Text style={styles.phoneNote}>8 digits (Tunisian CIN format)</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={personalInfo.phone}
          onChangeText={(text) => setPersonalInfo({...personalInfo, phone: text})}
          placeholder="12345678"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          maxLength={8}
          autoCorrect={false}
          editable={true}
        />
        <Text style={styles.phoneNote}>8 digits (Tunisian format)</Text>
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
            value={personalInfo.postalCode.toString()}
            onChangeText={(text) => setPersonalInfo({...personalInfo, postalCode: parseInt(text) || 0})}
            placeholder="1000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            maxLength={4}
            autoCorrect={false}
            editable={true}
          />
          <Text style={styles.phoneNote}>4 digits (Tunisian postal code)</Text>
        </View>
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
            value={bankInfo.employeeId.toString()}
            onChangeText={(text) => setBankInfo({...bankInfo, employeeId: parseInt(text) || 0})}
            placeholder="123456"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            maxLength={6}
            autoCorrect={false}
            editable={true}
          />
          <Text style={styles.phoneNote}>6 digits (Employee ID)</Text>
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
          <Text style={styles.label}>Supervisor Phone *</Text>
          <TextInput
            style={styles.input}
            value={bankInfo.supervisorPhone}
            onChangeText={(text) => setBankInfo({...bankInfo, supervisorPhone: text})}
            placeholder="12345678"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            maxLength={8}
            autoCorrect={false}
            editable={true}
          />
          <Text style={styles.phoneNote}>8 digits (Tunisian format)</Text>
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
        {documents.nationalIdDocument ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: documents.nationalIdDocument }} style={styles.documentImage} />
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => pickImage('nationalIdDocument')}
            >
              <Text style={styles.changeButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => pickImage('nationalIdDocument')}
          >
            <Text style={styles.uploadButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.documentNote}>Take a clear photo of your national ID</Text>
      </View>

      <View style={styles.documentItem}>
        <Text style={styles.documentLabel}>Bank Employment Letter *</Text>
        {documents.bankEmploymentLetter ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: documents.bankEmploymentLetter }} style={styles.documentImage} />
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => pickImage('bankEmploymentLetter')}
            >
              <Text style={styles.changeButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => pickImage('bankEmploymentLetter')}
          >
            <Text style={styles.uploadButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.documentNote}>Take a photo of your official employment letter</Text>
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
          <Text style={styles.reviewLabel}>First Name:</Text>
          <Text style={styles.reviewValue}>{personalInfo.firstName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Last Name:</Text>
          <Text style={styles.reviewValue}>{personalInfo.lastName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Date of Birth:</Text>
          <Text style={styles.reviewValue}>{personalInfo.dateOfBirth}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>National ID:</Text>
          <Text style={styles.reviewValue}>{personalInfo.nationalId.toString()}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Phone:</Text>
          <Text style={styles.reviewValue}>{personalInfo.phone}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Address:</Text>
          <Text style={styles.reviewValue}>{personalInfo.address}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>City:</Text>
          <Text style={styles.reviewValue}>{personalInfo.city}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Postal Code:</Text>
          <Text style={styles.reviewValue}>{personalInfo.postalCode.toString()}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Bank Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Bank Name:</Text>
          <Text style={styles.reviewValue}>{bankInfo.bankName}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Position:</Text>
          <Text style={styles.reviewValue}>{bankInfo.position}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Employee ID:</Text>
          <Text style={styles.reviewValue}>{bankInfo.employeeId.toString()}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Department:</Text>
          <Text style={styles.reviewValue}>{bankInfo.department}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Work Address:</Text>
          <Text style={styles.reviewValue}>{bankInfo.workAddress || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Supervisor Name:</Text>
          <Text style={styles.reviewValue}>{bankInfo.supervisorName || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Supervisor Phone:</Text>
          <Text style={styles.reviewValue}>{bankInfo.supervisorPhone}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Documents</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>National ID Document:</Text>
          <Text style={styles.reviewValue}>{documents.nationalIdDocument ? '✅ Uploaded' : '❌ Not uploaded'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Bank Employment Letter:</Text>
          <Text style={styles.reviewValue}>{documents.bankEmploymentLetter ? '✅ Uploaded' : '❌ Not uploaded'}</Text>
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

  // Show loading while checking registration
  if (isCheckingRegistration) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Checking registration status...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
            {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🏦</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Bank Agent Registration</Text>
              <Text style={styles.subtitle}>Complete your profile to get started</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    marginBottom: 8,
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
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
    minHeight: 48,
    textAlignVertical: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'center',
  },
  ageNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  phoneNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  documentImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  changeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  documentItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
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
    borderRadius: 8,
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
    borderRadius: 8,
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
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutIcon: {
    fontSize: 18,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 20,
  },
});
