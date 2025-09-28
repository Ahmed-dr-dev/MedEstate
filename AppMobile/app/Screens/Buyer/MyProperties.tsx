import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL } from '../../../constants/api';
import BottomNavigation from '../../../components/Buyer/BottomNavigation';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  property_type?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export default function MyProperties() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      console.log('Fetching properties for user ID:', user.id);
      
      const response = await fetch(`${API_BASE_URL}/properties/my-properties?owner_id=${user.id}`);
      const result = await response.json();

      console.log('API Response:', result);

      if (result.success && result.data) {
        console.log('Properties found:', result.data.length);
        setProperties(result.data);
      } else {
        console.log('No properties found or API error:', result.error);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      Alert.alert('Error', 'Failed to fetch your properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (propertyId: string, propertyTitle: string) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProperty(propertyId),
        },
      ]
    );
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      console.log('Deleting property:', propertyId, 'for user:', user.id);

      const response = await fetch(`${API_BASE_URL}/properties/my-properties?property_id=${propertyId}&owner_id=${user.id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete result:', result);

      if (result.success) {
        Alert.alert('Success', 'Property deleted successfully');
        // Remove the property from the local state
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
      } else {
        Alert.alert('Error', result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete property. Please try again.');
    }
  };

  const handleEditProperty = (property: Property) => {
    // Navigate to edit property screen with the property data
    router.push({
      pathname: '/Screens/Buyer/EditProperty',
      params: { propertyId: property.id }
    });
  };

  const renderPropertyCard = (property: Property) => (
    <Animated.View
      key={property.id}
      style={[
        styles.propertyCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.propertyImageContainer}>
        {property.images && property.images.length > 0 ? (
          <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>🏠</Text>
          </View>
        )}
        <View style={styles.propertyBadge}>
          <Text style={styles.propertyBadgeText}>Your Property</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation}>📍 {property.location}</Text>
        <Text style={styles.propertyPrice}>{property.price.toLocaleString()} د.ت</Text>
        
        {property.bedrooms && property.bathrooms && (
          <Text style={styles.propertyDetails}>
            {property.bedrooms} bed • {property.bathrooms} bath
            {property.area && ` • ${property.area} sq ft`}
          </Text>
        )}

        <View style={styles.propertyActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProperty(property)}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProperty(property.id, property.title)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your properties...</Text>
        </View>
        <BottomNavigation />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>My Properties</Text>
            <Text style={styles.subtitle}>Manage your property listings</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/Screens/Buyer/AddProperty')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{properties.filter(p => p.images && p.images.length > 0).length}</Text>
            <Text style={styles.statLabel}>With Images</Text>
          </View>
        </Animated.View>

        {/* Properties List */}
        {properties.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyTitle}>No Properties Yet</Text>
            <Text style={styles.emptyText}>
              You haven't added any properties yet. Start by adding your first property!
            </Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => router.push('/Screens/Buyer/AddProperty')}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Property</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.propertiesContainer}>
            <Text style={styles.sectionTitle}>Your Properties</Text>
            {properties.map(renderPropertyCard)}
          </View>
        )}
      </Animated.ScrollView>
      
      <BottomNavigation />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  propertiesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  propertyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  propertyImageContainer: {
    position: 'relative',
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 48,
    color: '#64748b',
  },
  propertyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  propertyDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  propertyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
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
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
