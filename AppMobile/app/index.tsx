import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { router } from 'expo-router';
const { width, height } = Dimensions.get('window');

export default function Index() {
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
        <View style={[styles.floatingCircle, styles.circle3]} />
        <View style={[styles.floatingSquare, styles.square1]} />
        <View style={[styles.floatingSquare, styles.square2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.modernLogo}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoIconText}>M</Text>
                </View>
                <Text style={styles.brandName}>RealEstate</Text>
              </View>
              <Text style={styles.tagline}>Where Real Estate Meets your needs</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>Find Your Perfect{'\n'}Real Estate</Text>
              <Text style={styles.heroSubtitle}>
                Discover premium real estate properties tailored for your needs
              </Text>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => router.push('/Screens/signup')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonGradient}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <View style={styles.buttonArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/Screens/signin')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    width: 80,
    height: 80,
    top: height * 0.15,
    right: width * 0.1,
  },
  circle2: {
    width: 60,
    height: 60,
    top: height * 0.4,
    left: width * 0.05,
  },
  circle3: {
    width: 40,
    height: 40,
    bottom: height * 0.3,
    right: width * 0.2,
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
    top: height * 0.25,
    left: width * 0.15,
  },
  square2: {
    width: 50,
    height: 50,
    bottom: height * 0.15,
    left: width * 0.7,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  headerSection: {
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  modernLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  heroSection: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  actionSection: {
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
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
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});