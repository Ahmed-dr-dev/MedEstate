import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { API_BASE_URL } from '../../../constants/api';

interface User {
  id: string;
  email: string;
  display_name?: string;
  phone?: string;
  role?: string;
  address?: string;
  city?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'buyer' | 'bank_agent' | 'admin'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'bank_agent': return '#3b82f6';
      case 'buyer': return '#10b981';
      default: return '#64748b';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'bank_agent': return '🏦';
      case 'buyer': return '👤';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const handleUserAction = (userId: string, action: 'view' | 'contact') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view':
        Alert.alert(
          'User Details',
          `Name: ${user.display_name || 'N/A'}\nEmail: ${user.email}\nPhone: ${user.phone || 'N/A'}\nRole: ${user.role || 'N/A'}\nCity: ${user.city || 'N/A'}\nJoined: ${new Date(user.created_at).toLocaleDateString()}`
        );
        break;
      case 'contact':
        Alert.alert('Contact User', `Contact ${user.display_name || 'User'} at ${user.email}`);
        break;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleFilters = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length },
    { id: 'buyer', label: 'Buyers', count: users.filter(u => u.role === 'buyer').length },
    { id: 'bank_agent', label: 'Bank Agents', count: users.filter(u => u.role === 'bank_agent').length },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Role Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {roleFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedRole === filter.id && styles.activeFilterButton
              ]}
              onPress={() => setSelectedRole(filter.id as any)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedRole === filter.id && styles.activeFilterButtonText
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterBadge,
                selectedRole === filter.id && styles.activeFilterBadge
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  selectedRole === filter.id && styles.activeFilterBadgeText
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Users Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users match your search criteria' : 'No users found for the selected role'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {(user.display_name || user.email).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.display_name || 'N/A'}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
                    {user.city && <Text style={styles.userPhone}>{user.city}</Text>}
                  </View>
                </View>
                <View style={styles.userStatus}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.roleIcon}>{getRoleIcon(user.role)}</Text>
                    <Text style={styles.roleText}>{(user.role || 'USER').replace('_', ' ').toUpperCase()}</Text>
                  </View>
                </View>
              </View>

              {user.address && (
                <View style={styles.bankAgentInfo}>
                  <Text style={styles.bankAgentLabel}>Address:</Text>
                  <Text style={styles.bankAgentText}>{user.address}</Text>
                </View>
              )}

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleUserAction(user.id, 'view')}
                >
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.contactButton]}
                  onPress={() => handleUserAction(user.id, 'contact')}
                >
                  <Text style={[styles.actionButtonText, styles.contactButtonText]}>Contact</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.userMeta}>
                <Text style={styles.metaText}>
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.metaText}>
                  Last Updated: {new Date(user.updated_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: 'white',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
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
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  roleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  bankAgentInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  bankAgentLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontWeight: '600',
  },
  bankAgentText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  contactButtonText: {
    color: 'white',
  },
  userMeta: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});