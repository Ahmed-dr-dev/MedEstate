import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BuyerBottomNavigation from '../../../components/Buyer/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

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

// Mock data for Dubai developer houses (Acube promotion)
const dubaiDeveloperHouses: Property[] = [
  {
    id: 'dubai-1',
    title: 'Luxury Villa in Palm Jumeirah',
    description: 'Stunning waterfront villa with private beach access and panoramic views of the Arabian Gulf.',
    price: 8500000,
    location: 'Palm Jumeirah, Dubai, UAE',
    bedrooms: 6,
    bathrooms: 7,
    area: 8500,
    property_type: 'Villa',
    images: [
      '../../../images/anga/acube1.jpg',
      '../../../images/anga/acube 2.jpg',
      '../../../images/anga/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dubai-2',
    title: 'Modern Apartment in Downtown Dubai',
    description: 'Contemporary apartment in the heart of Dubai with Burj Khalifa views and premium amenities.',
    price: 3200000,
    location: 'Downtown Dubai, UAE',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    property_type: 'Apartment',
    images: [
      '../../../images/anga/acube1.jpg',
      '../../../images/anga/acube 2.jpg',
      '../../../images/anga/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dubai-3',
    title: 'Penthouse in Marina Walk',
    description: 'Exclusive penthouse with private terrace overlooking Dubai Marina and the Arabian Gulf.',
    price: 12000000,
    location: 'Dubai Marina, UAE',
    bedrooms: 4,
    bathrooms: 5,
    area: 4500,
    property_type: 'Penthouse',
    images: [
      '../../../images/anga/acube1.jpg',
      '../../../images/anga/acube 2.jpg',
      '../../../images/anga/acube 3.jpg',
    ],
    owner: {
      display_name: 'Acube - Dubai',
      phone: '+971-4-123-4567'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Mock data for Anga Esghaier developer houses (Esghaier Immobilière promotion)
const esgaiherTunisiaHouses: Property[] = [
  {
    id: 'esgaiher-1',
    title: 'Villa Moderne à Sidi Bou Saïd',
    description: 'Villa contemporaine avec vue sur la mer Méditerranée et architecture traditionnelle tunisienne.',
    price: 450000,
    location: 'Sidi Bou Saïd, Tunis, Tunisie',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    property_type: 'Villa',
    images: [
      '../../../images/anga/Anga.jpg',
      '../../../images/anga/anga2.jpg',
      '../../../images/anga/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-2',
    title: 'Appartement de Luxe à Carthage',
    description: 'Appartement haut de gamme dans le quartier historique de Carthage avec vue sur les ruines antiques.',
    price: 320000,
    location: 'Carthage, Tunis, Tunisie',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    property_type: 'Apartment',
    images: [
      '../../../images/anga/Anga.jpg',
      '../../../images/anga/anga2.jpg',
      '../../../images/anga/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-3',
    title: 'Villa Familiale à La Marsa',
    description: 'Villa spacieuse pour famille avec jardin privé et piscine, proche des plages de La Marsa.',
    price: 680000,
    location: 'La Marsa, Tunis, Tunisie',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    property_type: 'Villa',
    images: [
      '../../../images/anga/Anga.jpg',
      '../../../images/anga/anga2.jpg',
      '../../../images/anga/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'esgaiher-4',
    title: 'Studio Moderne à Tunis Centre',
    description: 'Studio moderne et fonctionnel au cœur de Tunis, idéal pour investissement locatif.',
    price: 85000,
    location: 'Tunis Centre, Tunisie',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    property_type: 'Studio',
    images: [
      '../../../images/anga/Anga.jpg',
      '../../../images/anga/anga2.jpg',
      '../../../images/anga/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const allProperties = [...dubaiDeveloperHouses, ...esgaiherTunisiaHouses];

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -20,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    };

    setTimeout(() => createFloatingAnimation(floatAnim1, 0).start(), 500);
    setTimeout(() => createFloatingAnimation(floatAnim2, 1000).start(), 1000);
    setTimeout(() => createFloatingAnimation(floatAnim3, 2000).start(), 1500);
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const savedProperties = await AsyncStorage.getItem('savedProperties');
      const likedPropertyIds = savedProperties ? JSON.parse(savedProperties) : [];
      
      // Filter properties that are in the saved list
      const favoriteProperties = allProperties.filter(property => 
        likedPropertyIds.includes(property.id)
      );
      
      setFavorites(favoriteProperties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this property from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get current saved properties
              const savedProperties = await AsyncStorage.getItem('savedProperties');
              const likedPropertyIds = savedProperties ? JSON.parse(savedProperties) : [];
              
              // Remove the property from the list
              const updatedProperties = likedPropertyIds.filter((id: string) => id !== propertyId);
              await AsyncStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
              
              // Update local state
              setFavorites(favorites.filter(item => item.id !== propertyId));
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderFavorite = ({ item }: { item: Property }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity
        style={styles.propertyContent}
        onPress={() => router.push(`/Screens/Buyer/PropertyDetails?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ 
            uri: item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://via.placeholder.com/100x100?text=No+Image'
          }} 
          style={styles.propertyImage} 
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.propertyPrice}>{item.price.toLocaleString()} TND</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.propertyLocation}>{item.location}</Text>
          </View>
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyDetail}>🛏️ {item.bedrooms}</Text>
            <Text style={styles.propertyDetail}>🚿 {item.bathrooms}</Text>
            <Text style={styles.propertyDetail}>📐 {item.area ? `${item.area} m²` : 'N/A'}</Text>
          </View>
          <Text style={styles.dateAdded}>Added {formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Properties you save as favorites will appear here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/Screens/Buyer/BrowseProperties')}
      >
        <Text style={styles.browseButtonText}>Browse Properties</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1e293b', '#334155', '#1e293b']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Floating Background Elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle1,
          {
            top: 100,
            right: -40,
            transform: [{ translateY: floatAnim1 }],
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.square1,
          {
            top: 300,
            left: -30,
            transform: [{ translateY: floatAnim2 }],
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.circle2,
          {
            bottom: 200,
            right: -30,
            transform: [{ translateY: floatAnim3 }],
          }
        ]} 
      />
      
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.favoritesIconContainer}>
            <Text style={styles.favoritesIcon}>❤️</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>My Favorites</Text>
            <Text style={styles.subtitle}>
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </Text>
          </View>
        </View>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.favoritesList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchFavorites}
        />
      )}

      <BuyerBottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  floatingElement: {
    position: 'absolute',
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
  },
  square1: {
    width: 80,
    height: 80,
    backgroundColor: '#8b5cf6',
    transform: [{ rotate: '45deg' }],
  },
  circle2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#06b6d4',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoritesIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  favoritesIcon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  favoritesList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 10,
  },
  favoriteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
    backdropFilter: 'blur(10px)',
  },
  propertyContent: {
    flexDirection: 'row',
    padding: 20,
  },
  propertyImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  propertyDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyDetail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '600',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateAdded: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    fontWeight: '500',
  },
  browseButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  browseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});