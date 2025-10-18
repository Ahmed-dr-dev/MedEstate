import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { PropertyCard } from '../../../components';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';



const { width } = Dimensions.get('window');

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
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
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
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
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
      '../../logos/acube1.jpg',
      '../../logos/acube 2.jpg',
      '../../logos/acube 3.jpg',
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
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
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
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
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
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
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
      '../../logos/Anga.jpg',
      '../../logos/anga2.jpg',
      '../../logos/download.jpg',
    ],
    owner: {
      display_name: 'Esghaier Immobilier - Anga Esghaier',
      phone: '+216-71-123-456'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export default function BrowseProperties() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState('dubai');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

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

  // Get properties based on selected developer
  const properties = useMemo(() => {
    return selectedDeveloper === 'dubai' ? dubaiDeveloperHouses : esgaiherTunisiaHouses;
  }, [selectedDeveloper]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'house', label: 'House' },
    { key: 'apartment', label: 'Apartment' },
    { key: 'condo', label: 'Condo' },
    { key: 'townhouse', label: 'Townhouse' },
    { key: 'commercial', label: 'Commercial' }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         property.property_type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleLike = (id: string) => {
    // TODO: Implement save to saved_properties table
    console.log('Like property:', id);
  };

  const handleView = (id: string) => {
    router.push({
      pathname: '/Screens/Buyer/PropertyDetails',
      params: { id: id }
    });
  };

  return (
    <View style={styles.container}>
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
      
      <Animated.ScrollView 
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchHeaderIcon}>🔍</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Find Your Home 🏠</Text>
              <Text style={styles.userName}>Browse Properties</Text>
              <Text style={styles.subtitle}>Discover your perfect property</Text>
            </View>
          </View>
      
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties, locations..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Developer Selection */}
        <View style={styles.developerSection}>
          <Text style={styles.developerSectionTitle}>Select Developer</Text>
          <View style={styles.developerToggle}>
            <TouchableOpacity
              style={[
                styles.developerOption,
                selectedDeveloper === 'dubai' && styles.activeDeveloperOption
              ]}
              onPress={() => setSelectedDeveloper('dubai')}
            >
              <Text style={[
                styles.developerOptionText,
                selectedDeveloper === 'dubai' && styles.activeDeveloperOptionText
              ]}>
                🏙️ Dubai (Acube)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.developerOption,
                selectedDeveloper === 'esgaiher' && styles.activeDeveloperOption
              ]}
              onPress={() => setSelectedDeveloper('esgaiher')}
            >
              <Text style={[
                styles.developerOptionText,
                selectedDeveloper === 'esgaiher' && styles.activeDeveloperOptionText
              ]}>
                🏛️ Anga Esghaier - Esghaier Immobilière
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.key && styles.activeFilterChip
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.key && styles.activeFilterChipText
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredProperties.length} properties found
            </Text>
          
          </View>

          {/* Properties Grid */}
          <View style={styles.propertiesGrid}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onLike={handleLike}
                onView={handleView}
                userId={user?.id}
              />
            ))}
          </View>
        </View>
      </Animated.ScrollView>

    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchHeaderIcon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterIcon: {
    fontSize: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  developerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  developerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  developerToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  developerOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeDeveloperOption: {
    backgroundColor: '#3b82f6',
  },
  developerOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  activeDeveloperOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  filtersSection: {
    paddingVertical: 16,
    marginBottom: 12,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeFilterChipText: {
    color: 'white',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  sortButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  propertiesGrid: {
    gap: 16,
  },
  propertyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  propertyImageSection: {
    position: 'relative',
    padding: 20,
    paddingBottom: 16,
  },
  propertyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  propertyImage: {
    fontSize: 32,
  },
  likeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 20,
  },
  likedIcon: {
    fontSize: 20,
  },
  propertyTypeBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  propertyTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  propertyContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  propertySize: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  propertyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceSection: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  pricePerSqft: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});