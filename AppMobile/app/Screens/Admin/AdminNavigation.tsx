import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type DashboardTab = 'overview' | 'bank-agents' | 'users' | 'profile';

interface AdminNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  const tabs = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: '📊' },
    { id: 'bank-agents' as DashboardTab, label: 'Bank Agents', icon: '🏦' },
    { id: 'users' as DashboardTab, label: 'Users', icon: '👥' },
    { id: 'profile' as DashboardTab, label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabLabel: {
    color: 'white',
  },
});
