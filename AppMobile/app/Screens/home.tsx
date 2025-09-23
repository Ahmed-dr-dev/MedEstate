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
import { API_BASE_URL } from '@/constants/api';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationHeader } from '../../components/NavigationHeader';
import { ProtectedRoute } from '../../components/ProtectedRoute';
const { width, height } = Dimensions.get('window');

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState('Ready to test');
  const [isLoading, setIsLoading] = useState(false);
  const { user, navigateToRoleHome } = useAuth();

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/TestConnection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  const handleGoToRoleHome = () => {
    navigateToRoleHome();
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
          <NavigationHeader 
            title="Admin Dashboard" 
            subtitle={`Welcome back, ${user?.display_name || 'Admin'}`}
          />
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.roleHomeButton} onPress={handleGoToRoleHome}>
                <Text style={styles.roleHomeButtonText}>Go to Role-Specific Dashboard</Text>
                <Text style={styles.roleHomeSubtext}>Access your {user?.role} dashboard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Total Properties</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active Users</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Pending Loans</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>New Signups</Text>
              </View>
            </View>
            
            <View style={styles.systemCard}>
              <Text style={styles.cardTitle}>System Status</Text>
              <Text style={styles.statusText}>{connectionStatus}</Text>
              <TouchableOpacity 
                style={[styles.testButton, isLoading && styles.disabledButton]}
                onPress={testConnection}
                disabled={isLoading}
              >
                <Text style={styles.testButtonText}>
                  {isLoading ? 'Testing...' : 'Test Backend Connection'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.roleActions}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/Screens/Buyer/BrowseProperties')}
              >
                <Text style={styles.actionTitle}>🏠 Browse Properties</Text>
                <Text style={styles.actionSubtitle}>View all available properties</Text>
              </TouchableOpacity>
              
            
               
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/Screens/BankAgent/LoanReviewDashboard')}
              >
                <Text style={styles.actionTitle}>🏦 Loan Reviews</Text>
                <Text style={styles.actionSubtitle}>Review loan applications</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ProtectedRoute>
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
    paddingHorizontal: 20,
  },
  quickActions: {
    marginBottom: 24,
  },
  roleHomeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
  },
  roleHomeButtonText: {
    color: '#60a5fa',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleHomeSubtext: {
    color: 'rgba(96, 165, 250, 0.8)',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    margin: '1%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  systemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  roleActions: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});