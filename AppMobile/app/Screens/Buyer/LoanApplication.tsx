import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

export default function LoanApplication() {

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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Loan Application</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Loan Application Center</Text>
          <Text style={styles.welcomeSubtitle}>Choose your application method</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navigationButton, styles.primaryButton]}
            onPress={() => router.push('/Screens/Buyer/LoanApplicationResults')}
          >
            <Text style={styles.primaryButtonText}>📊 My Loan Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navigationButton, styles.secondaryButton]}
            onPress={() => router.push('/Screens/Buyer/NewLoanApplication')}
          >
            <Text style={styles.secondaryButtonText}>📝 New Application Process</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 60,
  },
  welcomeContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  navigationButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  secondaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});