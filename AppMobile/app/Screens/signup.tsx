import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
const { width, height } = Dimensions.get('window');

interface FormData {
  display_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'bank_agent' ;
}

export default function SignUpScreen() {
  const [formData, setFormData] = useState<FormData>({
    display_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);

  const roles = [
    { value: 'buyer', label: 'Buyer', description: 'Looking to purchase  properties' },
    { value: 'bank_agent', label: 'Bank Agent', description: 'Financial institution representative' },

  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const { display_name, email, phone, password, confirmPassword } = formData;

    if (!display_name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (phone.trim() && !validatePhone(phone.trim())) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          display_name: formData.display_name.trim(),
          phone: formData.phone.trim() || null,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success!',
          'Account created successfully! Please check your email for verification if required.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/Screens/signin')
            }
          ]
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <View style={[styles.floatingCircle, styles.circle1]} />
        <View style={[styles.floatingCircle, styles.circle2]} />
        <View style={[styles.floatingSquare, styles.square1]} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoIconText}>M</Text>
                </View>
                <Text style={styles.brandName}>MedEstate</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us and start your medical journey
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.display_name}
                    onChangeText={(value) => handleInputChange('display_name', value)}
                    placeholder="Enter your full name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email address"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    placeholder="Enter your phone number"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Role</Text>
                <TouchableOpacity 
                  style={styles.inputWrapper}
                  onPress={() => setShowRolePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.input}>
                    <Text style={styles.roleText}>
                      {roles.find(r => r.value === formData.role)?.label || 'Select Role'}
                    </Text>
                    <Text style={styles.roleArrow}>▼</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Enter your password (min 6 characters)"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirement}>
                  <Text style={[
                    styles.requirementText,
                    formData.password.length >= 6 && styles.requirementMet
                  ]}>
                    • At least 6 characters
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Text style={[
                    styles.requirementText,
                    formData.password === formData.confirmPassword && 
                    formData.password.length > 0 && styles.requirementMet
                  ]}>
                    • Passwords match
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.signUpButton, loading && styles.disabledButton]}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text style={styles.signUpButtonText}>Create Account</Text>
                      <View style={styles.buttonArrow}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Text style={styles.signInButtonText}>
                  Already have an account? <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Picker Modal */}
      <Modal
        visible={showRolePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Role</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowRolePicker(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.rolesList}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleOption,
                    formData.role === role.value && styles.selectedRole
                  ]}
                  onPress={() => {
                    handleInputChange('role', role.value);
                    setShowRolePicker(false);
                  }}
                >
                  <View style={styles.roleInfo}>
                    <Text style={[
                      styles.roleOptionLabel,
                      formData.role === role.value && styles.selectedRoleText
                    ]}>
                      {role.label}
                    </Text>
                    <Text style={[
                      styles.roleDescription,
                      formData.role === role.value && styles.selectedRoleDescription
                    ]}>
                      {role.description}
                    </Text>
                  </View>
                  {formData.role === role.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
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
    width: 60,
    height: 60,
    top: height * 0.2,
    right: width * 0.1,
  },
  circle2: {
    width: 40,
    height: 40,
    bottom: height * 0.3,
    left: width * 0.05,
  },
  floatingSquare: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    transform: [{ rotate: '45deg' }],
  },
  square1: {
    width: 30,
    height: 30,
    top: height * 0.35,
    left: width * 0.15,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    minHeight: height - (StatusBar.currentHeight || 40),
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
  },
  passwordRequirements: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  requirement: {
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  requirementMet: {
    color: '#22c55e',
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  signInButton: {
    paddingVertical: 12,
  },
  signInButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  signInLink: {
    color: 'white',
    fontWeight: '600',
  },
  roleText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  roleArrow: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rolesList: {
    padding: 16,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedRole: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  roleInfo: {
    flex: 1,
  },
  roleOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  selectedRoleText: {
    color: '#60a5fa',
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  selectedRoleDescription: {
    color: 'rgba(96, 165, 250, 0.8)',
  },
  checkmark: {
    fontSize: 18,
    color: '#60a5fa',
    fontWeight: 'bold',
  },
});