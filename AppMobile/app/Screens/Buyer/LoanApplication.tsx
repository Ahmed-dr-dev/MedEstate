import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import BuyerBottomNavigation from '../../../components/Buyer/BottomNavigation';


const { width, height } = Dimensions.get('window');

export default function LoanApplication() {
  const router = useRouter();
  
  // Animation values
  const floatingAnimation1 = useRef(new Animated.Value(0)).current;
  const floatingAnimation2 = useRef(new Animated.Value(0)).current;
  const floatingAnimation3 = useRef(new Animated.Value(0)).current;
  const floatingAnimation4 = useRef(new Animated.Value(0)).current;
  const floatingAnimation5 = useRef(new Animated.Value(0)).current;
  const floatingAnimation6 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create floating animations
    const createFloatingAnimation = (animatedValue: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            delay: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all animations
    createFloatingAnimation(floatingAnimation1, 3000, 0).start();
    createFloatingAnimation(floatingAnimation2, 4000, 500).start();
    createFloatingAnimation(floatingAnimation3, 3500, 1000).start();
    createFloatingAnimation(floatingAnimation4, 4500, 1500).start();
    createFloatingAnimation(floatingAnimation5, 3200, 2000).start();
    createFloatingAnimation(floatingAnimation6, 3800, 2500).start();
  }, []);

  const navigateToApplicationFlow = () => {
    router.push('/Screens/Buyer/NewLoanApplication');
  };

  const navigateToApplicationResults = () => {
    router.push('/Screens/Buyer/LoanApplicationResults');
  };

  const renderFloatingElement = (animatedValue: Animated.Value, size: number, left: number, top: number, emoji: string) => {
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 0.5, 0.2],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.9, 1.1, 0.9],
    });

    return (
      <Animated.View
        style={[
          styles.floatingElement,
          {
            left: left,
            top: top,
            width: size,
            height: size,
            transform: [{ translateY }, { scale }],
            opacity: opacity,
          },
        ]}
      >
        <Text style={[styles.floatingEmoji, { fontSize: size * 0.6 }]}>{emoji}</Text>
      </Animated.View>
    );
  };




  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Animated Background - Above and Below Buttons */}
      <View style={styles.animatedBackground}>
        {/* Above buttons */}
        {renderFloatingElement(floatingAnimation1, 50, width * 0.2, height * 0.25, '🏠')}
        {renderFloatingElement(floatingAnimation2, 45, width * 0.75, height * 0.2, '💰')}
        {renderFloatingElement(floatingAnimation3, 55, width * 0.15, height * 0.3, '📊')}
        
        {/* Below buttons */}
        {renderFloatingElement(floatingAnimation4, 40, width * 0.8, height * 0.75, '📋')}
        {renderFloatingElement(floatingAnimation5, 48, width * 0.25, height * 0.8, '🏦')}
        {renderFloatingElement(floatingAnimation6, 52, width * 0.7, height * 0.7, '📈')}
      </View>

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Loan Applications 📋</Text>
            <Text style={styles.userName}>Manage Your Applications</Text>
      </View>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpIcon}>❓</Text>
          </TouchableOpacity>
      </View>

        {/* Main Action Buttons - Centered */}
        <View style={styles.centeredContent}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.primaryActionButton} 
              onPress={navigateToApplicationFlow}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonIcon}>🚀</Text>
                <View style={styles.actionButtonText}>
                  <Text style={styles.actionButtonTitle}>Start Loan Application</Text>
                  <Text style={styles.actionButtonSubtitle}>Begin your loan application process</Text>
                </View>
                <Text style={styles.actionButtonArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionButton} 
              onPress={navigateToApplicationResults}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonIcon}>📊</Text>
                <View style={styles.actionButtonText}>
                  <Text style={styles.secondaryActionButtonTitle}>See Your Applications</Text>
                  <Text style={styles.secondaryActionButtonSubtitle}>View all your loan applications</Text>
                </View>
                <Text style={styles.secondaryActionButtonArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <BuyerBottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  floatingEmoji: {
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 100,
    zIndex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
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
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 16,
  },
  primaryActionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  actionButtonArrow: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  // Secondary button specific styles
  secondaryActionButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  secondaryActionButtonSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  secondaryActionButtonArrow: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});