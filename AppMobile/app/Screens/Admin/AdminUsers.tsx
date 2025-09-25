import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'bank-agent' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalLoans: number;
  completedLoans: number;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'borrower' | 'bank-agent' | 'admin'>('all');

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'borrower',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      totalLoans: 2,
      completedLoans: 1,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bank.com',
      role: 'bank-agent',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-20',
      totalLoans: 15,
      completedLoans: 12,
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      role: 'borrower',
      status: 'inactive',
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      totalLoans: 1,
      completedLoans: 0,
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@metro.com',
      role: 'bank-agent',
      status: 'active',
      joinDate: '2024-01-12',
      lastActive: '2024-01-20',
      totalLoans: 8,
      completedLoans: 6,
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      role: 'borrower',
      status: 'suspended',
      joinDate: '2024-01-08',
      lastActive: '2024-01-15',
      totalLoans: 0,
      completedLoans: 0,
    },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#8b5cf6';
      case 'bank-agent': return '#3b82f6';
      case 'borrower': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'bank-agent': return '🏦';
      case 'borrower': return '👤';
      default: return '❓';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'inactive': return '⏸️';
      case 'suspended': return '🚫';
      default: return '❓';
    }
  };

  const handleUserAction = (userId: string, action: 'view' | 'suspend' | 'activate' | 'delete') => {
    const user = users.find(u => u.id === userId);
    Alert.alert(
      'User Management',
      `What would you like to do with ${user?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'View Profile',
          onPress: () => Alert.alert('User Profile', 'Detailed user information would be shown here')
        },
        { 
          text: user?.status === 'active' ? 'Suspend' : 'Activate',
          style: user?.status === 'active' ? 'destructive' : 'default',
          onPress: () => Alert.alert('Success', `User ${user?.status === 'active' ? 'suspended' : 'activated'} successfully!`)
        },
        { 
          text: 'Delete User',
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'User deleted successfully!')
        }
      ]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const renderUserCard = (user: User) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={styles.userBadges}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
            <Text style={styles.roleIcon}>{getRoleIcon(user.role)}</Text>
            <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
              {user.role.toUpperCase().replace('-', ' ')}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
            <Text style={styles.statusIcon}>{getStatusIcon(user.status)}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Join Date:</Text>
          <Text style={styles.detailValue}>{user.joinDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Active:</Text>
          <Text style={styles.detailValue}>{user.lastActive}</Text>
        </View>
        {user.role === 'bank-agent' && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Loans:</Text>
              <Text style={styles.detailValue}>{user.totalLoans}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Completed:</Text>
              <Text style={styles.detailValue}>{user.completedLoans}</Text>
            </View>
          </>
        )}
        {user.role === 'borrower' && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loan Applications:</Text>
              <Text style={styles.detailValue}>{user.totalLoans}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Approved:</Text>
              <Text style={styles.detailValue}>{user.completedLoans}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleUserAction(user.id, 'view')}
        >
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            user.status === 'active' ? styles.suspendButton : styles.activateButton
          ]}
          onPress={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
        >
          <Text style={[
            user.status === 'active' ? styles.suspendButtonText : styles.activateButtonText
          ]}>
            {user.status === 'active' ? 'Suspend' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const bankAgents = users.filter(u => u.role === 'bank-agent').length;
  const borrowers = users.filter(u => u.role === 'borrower').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>User Management 👥</Text>
        <Text style={styles.userName}>Manage all platform users</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>User Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>👥</Text>
              </View>
              <Text style={[styles.statValue, { color: '#3b82f6' }]}>{totalUsers}</Text>
            </View>
            <Text style={styles.statTitle}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>✅</Text>
              </View>
              <Text style={[styles.statValue, { color: '#10b981' }]}>{activeUsers}</Text>
            </View>
            <Text style={styles.statTitle}>Active Users</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>🏦</Text>
              </View>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>{bankAgents}</Text>
            </View>
            <Text style={styles.statTitle}>Bank Agents</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#8b5cf6' }]}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>👤</Text>
              </View>
              <Text style={[styles.statValue, { color: '#8b5cf6' }]}>{borrowers}</Text>
            </View>
            <Text style={styles.statTitle}>Borrowers</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.roleFilter}>
          {(['all', 'borrower', 'bank-agent', 'admin'] as const).map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                selectedRole === role && styles.activeFilterButton
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedRole === role && styles.activeFilterButtonText
              ]}>
                {role === 'all' ? 'All' : role.replace('-', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Users List */}
      <View style={styles.usersSection}>
        <Text style={styles.sectionTitle}>All Users ({filteredUsers.length})</Text>
        <View style={styles.usersList}>
          {filteredUsers.map(renderUserCard)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
  },
  roleFilter: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  usersSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  suspendButton: {
    backgroundColor: '#ef4444',
  },
  suspendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activateButton: {
    backgroundColor: '#10b981',
  },
  activateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
