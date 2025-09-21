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
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
const { width, height } = Dimensions.get('window');
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const result = await signIn(email.trim(), password.trim());
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to sign in');
    }
    // Success case is handled automatically by signIn function (auto-redirect)
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to your account to continue
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email address"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={() => router.push('/Screens/forgot-password')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.disabledButton]}
                onPress={handleSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text style={styles.signInButtonText}>Sign In</Text>
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
                style={styles.signUpButton}
                onPress={() => router.push('/Screens/signup')}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpButtonText}>
                  Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 24,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  signInButton: {
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
  signInButtonText: {
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
  signUpButton: {
    paddingVertical: 12,
  },
  signUpButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  signUpLink: {
    color: 'white',
    fontWeight: '600',
  },
});