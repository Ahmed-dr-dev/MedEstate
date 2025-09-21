import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  status: 'active' | 'pending' | 'sold';
  views: number;
  inquiries: number;
  datePosted: string;
}

export default function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    totalViews: 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'sold': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'sold': return 'Sold';
      default: return 'Unknown';
    }
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/Screens/Seller/EditProperty?id=${propertyId}`);
  };

  const handleMarkAsSold = (propertyId: string) => {
    Alert.alert(
      'Mark as Sold',
      'Are you sure you want to mark this property as sold?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Sold',
          onPress: () => {
            setProperties(properties.map(p => 
              p.id === propertyId ? { ...p, status: 'sold' as const } : p
            ));
            Alert.alert('Success', 'Property marked as sold!');
          }
        }
      ]
    );
  };

  const handleDeleteProperty = (propertyId: string) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProperties(properties.filter(p => p.id !== propertyId));
            Alert.alert('Success', 'Property deleted successfully!');
          }
        }
      ]
    );
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.propertyPrice}>${item.price.toLocaleString()}</Text>
        <Text style={styles.propertyLocation}>{item.location}</Text>
        
        <View style={styles.propertyStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.views}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.inquiries}</Text>
            <Text style={styles.statLabel}>Inquiries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.datePosted}</Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>
        </View>

        <View style={styles.propertyActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditProperty(item.id)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          {item.status === 'active' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.soldButton]}
              onPress={() => handleMarkAsSold(item.id)}
            >
              <Text style={styles.actionButtonText}>Mark Sold</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProperty(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏠</Text>
      <Text style={styles.emptyTitle}>No Properties Listed</Text>
      <Text style={styles.emptyText}>
        Start by adding your first property to the marketplace
      </Text>
      <TouchableOpacity
        style={styles.addPropertyButton}
        onPress={() => router.push('/Screens/Seller/AddProperty')}
      >
        <Text style={styles.addPropertyButtonText}>Add Property</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/Screens/Seller/AddProperty')}
        >
          <Text style={styles.addButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProperties}</Text>
          <Text style={styles.statTitle}>Total Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeListings}</Text>
          <Text style={styles.statTitle}>Active Listings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.soldProperties}</Text>
          <Text style={styles.statTitle}>Sold Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalViews}</Text>
          <Text style={styles.statTitle}>Total Views</Text>
        </View>
      </View>

      {properties.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.propertiesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  propertiesList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  propertyImage: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  propertyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  soldButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addPropertyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addPropertyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
