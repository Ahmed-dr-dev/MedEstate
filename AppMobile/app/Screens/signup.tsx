import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '@env';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, display_name, phone } = formData;
    
    if (!display_name.trim()) {
      Alert.alert('Error', 'Please enter your display name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (phone && phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(phone.trim())) {
      Alert.alert('Error', 'Please enter a valid phone number');
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
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success', 
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/Screens/signin')
            }
          ]
        );
      } else {
        Alert.alert('Error', data.error || 'Sign up failed');
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
        <View style={[styles.floatingSquare, styles.square2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
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
                <Text style={styles.subtitle}>Join the medical real estate community</Text>
              </View>

              {/* Form Section */}
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Display Name</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.display_name}
                      onChangeText={(value) => handleInputChange('display_name', value)}
                      placeholder="Enter your display name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone (Optional)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange('phone', value)}
                      placeholder="Enter your phone number"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="phone-pad"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholder="Create password (min 6 characters)"
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

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Already have an account?</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.signInButton}
                  onPress={() => router.push('/Screens/signin')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signInButtonText}>Sign In Instead</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Section */}
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>← Back to Welcome</Text>
                </TouchableOpacity>
                
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{'\n'}
                  <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    top: height * 0.15,
    right: width * 0.1,
  },
  circle2: {
    width: 40,
    height: 40,
    bottom: height * 0.25,
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
    top: height * 0.3,
    left: width * 0.15,
  },
  square2: {
    width: 25,
    height: 25,
    bottom: height * 0.35,
    right: width * 0.2,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  form: {
    flex: 1,
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
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
    marginBottom: 24,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginHorizontal: 16,
    letterSpacing: 0.3,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  signInButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  backButton: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  termsLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});
