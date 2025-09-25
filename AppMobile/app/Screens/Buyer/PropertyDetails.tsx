import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: string;
  description: string;
  images: string[];
  owner: {
    display_name: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails(id as string);
    }
  }, [id]);

  const fetchPropertyDetails = async (propertyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
      const result = await response.json();
      
      if (result.success) {
        setProperty(result.data);
      } else {
        Alert.alert('Error', 'Failed to load property details');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      Alert.alert('Error', 'Network error. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (propertyId: string) => {
    if (!user?.id) {
      Alert.alert('Login Required', 'Please log in to save properties');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/properties/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          property_id: propertyId
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsLiked(result.data.is_saved);
        if (result.data.is_saved) {
          Alert.alert('Saved', 'Property saved to your favorites!');
        } else {
          Alert.alert('Removed', 'Property removed from favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleContact = (owner: any) => {
    Alert.alert(
      'Contact Owner',
      `Would you like to call ${owner.display_name} at ${owner.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call owner:', owner.phone) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
          >
            {property.images && property.images.length > 0 ? (
              property.images.map((image, index) => (
                <Image 
                  key={index}
                  source={{ uri: image }} 
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              ))
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>🏠</Text>
              </View>
            )}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.likeButton, isLiked && styles.likedButton]}
            onPress={() => handleLike(property.id)}
          >
            <Text style={[styles.likeIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.propertyTypeBadge}>
            <Text style={styles.propertyTypeText}>
              {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
            </Text>
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.contentSection}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyLocation}>📍 {property.location}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.propertyPrice}>{property.price.toLocaleString()} TND</Text>
            <Text style={styles.pricePerSqft}>
              {property.area ? `${Math.round(property.price / property.area).toLocaleString()} TND/m²` : ''}
            </Text>
          </View>

          {/* Property Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📏</Text>
              <Text style={styles.statLabel}>Area</Text>
              <Text style={styles.statValue}>{property.area ? `${property.area.toLocaleString()} m²` : 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🛏️</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
              <Text style={styles.statValue}>{property.bedrooms}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🚿</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
              <Text style={styles.statValue}>{property.bathrooms}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🏠</Text>
              <Text style={styles.statLabel}>Type</Text>
              <Text style={styles.statValue}>{property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description || 'No description available'}</Text>
          </View>

          {/* Property Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Features</Text>
            <View style={styles.featuresContainer}>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>✓ {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>✓ {property.bedrooms} Bedrooms</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>✓ {property.bathrooms} Bathrooms</Text>
              </View>
              {property.area && (
                <View style={styles.featureTag}>
                  <Text style={styles.featureText}>✓ {property.area.toLocaleString()} m²</Text>
                </View>
              )}
            </View>
          </View>

          {/* Owner Info */}
          {property.owner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Owner</Text>
              <View style={styles.agentCard}>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{property.owner.display_name}</Text>
                  <Text style={styles.agentPhone}>📞 {property.owner.phone}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact(property.owner)}
                >
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    height: height * 0.5,
    position: 'relative',
  },
  imageScrollView: {
    flex: 1,
  },
  propertyImage: {
    width: width,
    height: '100%',
  },
  placeholderImage: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderText: {
    fontSize: 64,
    opacity: 0.5,
  },
  likeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 20,
  },
  likedButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  likedIcon: {
    fontSize: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  propertyTypeBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  propertyTypeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  priceSection: {
    marginBottom: 24,
  },
  propertyPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  pricePerSqft: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  featureText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  agentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  agentPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contactButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});