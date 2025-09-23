import React, { useState, useRef, useEffect } from 'react';
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
import BuyerBottomNavigation from '../../../components/Buyer/BottomNavigation';

const { width } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  size: string;
  type: string;
  isLiked: boolean;
  image: string;
  description: string;
  features: string[];
}

export default function BrowseProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
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
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern Downtown Condo',
      location: 'Downtown District',
      price: 850000,
      size: '2,500 sq ft',
      type: 'Condo',
      isLiked: false,
      image: '🏢',
      description: 'Luxury downtown condominium with modern amenities and prime city location.',
      features: ['Parking', 'Elevator', 'Security', 'High-Speed Internet']
    },
    {
      id: '2',
      title: 'Suburban Family Home',
      location: 'Residential Area',
      price: 1200000,
      size: '4,200 sq ft',
      type: 'Single Family',
      isLiked: true,
      image: '🏠',
      description: 'Spacious family home with multiple bedrooms, large backyard, and quiet neighborhood.',
      features: ['Parking', 'Garden', 'Multiple Rooms', 'Garage']
    },
    {
      id: '3',
      title: 'Luxury Apartment',
      location: 'Uptown District',
      price: 650000,
      size: '1,800 sq ft',
      type: 'Apartment',
      isLiked: false,
      image: '🏙️',
      description: 'High-end apartment with premium finishes and stunning city views.',
      features: ['Parking', 'Balcony', 'Modern Kitchen', 'Gym Access']
    },
    {
      id: '4',
      title: 'Townhouse',
      location: 'Historic District',
      price: 950000,
      size: '3,100 sq ft',
      type: 'Townhouse',
      isLiked: false,
      image: '🏘️',
      description: 'Charming townhouse with historic character and modern updates.',
      features: ['Parking', 'Private Entrance', 'Multiple Floors', 'Garden']
    },
    {
      id: '5',
      title: 'Penthouse Suite',
      location: 'Financial District',
      price: 750000,
      size: '2,800 sq ft',
      type: 'Penthouse',
      isLiked: true,
      image: '🏗️',
      description: 'Exclusive penthouse with panoramic city views and premium amenities.',
      features: ['Parking', 'Rooftop Access', 'Concierge', 'Premium Finishes']
    },
    {
      id: '6',
      title: 'Beach House',
      location: 'Coastal Area',
      price: 580000,
      size: '2,200 sq ft',
      type: 'Beach House',
      isLiked: false,
      image: '🏖️',
      description: 'Charming beach house with ocean views and direct beach access.',
      features: ['Parking', 'Ocean View', 'Private Beach', 'Deck']
    }
  ]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'condo', label: 'Condo' },
    { key: 'single', label: 'Single Family' },
    { key: 'apartment', label: 'Apartment' },
    { key: 'townhouse', label: 'Townhouse' }
  ];

  const toggleLike = (propertyId: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId ? { ...prop, isLiked: !prop.isLiked } : prop
    ));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         property.type.toLowerCase().includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const renderPropertyCard = (property: Property) => (
    <View key={property.id} style={styles.propertyCard}>
      <View style={styles.propertyImageSection}>
        <View style={styles.propertyImageContainer}>
          <Text style={styles.propertyImage}>{property.image}</Text>
        </View>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLike(property.id)}
        >
          <Text style={[styles.likeIcon, property.isLiked && styles.likedIcon]}>
            {property.isLiked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText}>{property.type}</Text>
        </View>
      </View>
      
      <View style={styles.propertyContent}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.propertyLocation}>{property.location}</Text>
        <Text style={styles.propertySize}>{property.size}</Text>
        <Text style={styles.propertyDescription} numberOfLines={2}>
          {property.description}
        </Text>
        
        <View style={styles.featuresContainer}>
          {property.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {property.features.length > 2 && (
            <View style={styles.featureTag}>
              <Text style={styles.featureText}>+{property.features.length - 2}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.propertyFooter}>
        <View style={styles.priceSection}>
          <Text style={styles.propertyPrice}>${property.price.toLocaleString()}</Text>
          <Text style={styles.pricePerSqft}>
            ${Math.round(property.price / parseInt(property.size.replace(/[^\d]/g, ''))).toLocaleString()}/sq ft
          </Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sort by Price</Text>
            </TouchableOpacity>
          </View>

          {/* Properties Grid */}
          <View style={styles.propertiesGrid}>
            {filteredProperties.map(renderPropertyCard)}
          </View>
        </View>
      </Animated.ScrollView>

      <BuyerBottomNavigation />
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