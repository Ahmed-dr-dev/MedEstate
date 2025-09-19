import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions
} from "react-native";
import { API_BASE_URL } from "@env";
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState('Ready to test');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/TestConnection`);
      const data = await response.json();
      console.log(data);
      setConnectionStatus('✅ Connection successful!');
    } catch (error) {
      console.error(error);
      setConnectionStatus('❌ Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    router.replace('/');
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
        <View style={[styles.floatingCircle, styles.circle3]} />
        <View style={[styles.floatingSquare, styles.square1]} />
        <View style={[styles.floatingSquare, styles.square2]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoIconText}>M</Text>
                </View>
                <Text style={styles.brandName}>MedEstate</Text>
              </View>
              <Text style={styles.welcomeText}>Welcome to your dashboard</Text>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <View style={styles.dashboardCard}>
                <Text style={styles.cardTitle}>System Status</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>{connectionStatus}</Text>
                  <Text style={styles.apiText}>API: {API_BASE_URL}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.testButton, isLoading && styles.disabledButton]}
                  onPress={testConnection}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.testButtonText}>
                      {isLoading ? 'Testing...' : 'Test Connection'}
                    </Text>
                    <View style={styles.buttonArrow}>
                      <Text style={styles.arrowText}>→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                
                <View style={styles.actionGrid}>
                  <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                    <View style={styles.actionIcon}>
                      <Text style={styles.actionIconText}>🏥</Text>
                    </View>
                    <Text style={styles.actionTitle}>Find Properties</Text>
                    <Text style={styles.actionDescription}>Browse medical facilities</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                    <View style={styles.actionIcon}>
                      <Text style={styles.actionIconText}>📊</Text>
                    </View>
                    <Text style={styles.actionTitle}>Analytics</Text>
                    <Text style={styles.actionDescription}>Market insights</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                    <View style={styles.actionIcon}>
                      <Text style={styles.actionIconText}>👥</Text>
                    </View>
                    <Text style={styles.actionTitle}>Network</Text>
                    <Text style={styles.actionDescription}>Connect with experts</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                    <View style={styles.actionIcon}>
                      <Text style={styles.actionIconText}>⚙️</Text>
                    </View>
                    <Text style={styles.actionTitle}>Settings</Text>
                    <Text style={styles.actionDescription}>Manage account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mainContent: {
    flex: 1,
  },
  dashboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  apiText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'monospace',
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonArrow: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 80) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  signOutText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
