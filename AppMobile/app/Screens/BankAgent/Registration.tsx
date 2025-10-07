import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export default function BankAgentRegistration() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect directly to dashboard
    if (user?.id) {
      router.replace('/Screens/BankAgent/Dashboard');
    }
  }, [user?.id, router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <View style={styles.loadingContent}>
        <Text style={styles.loadingText}>Redirecting to dashboard...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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