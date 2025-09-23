import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { BuyerBottomNav } from '../../../components/Buyer/BuyerBottomNav';

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
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Find Your Home 🏠</Text>
            <Text style={styles.userName}>Browse Properties</Text>
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
      </ScrollView>

      <BuyerBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#64748b',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filtersSection: {
    backgroundColor: 'white',
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
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeFilterChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeFilterChipText: {
    color: 'white',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
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
    color: '#1e293b',
  },
  sortButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  propertiesGrid: {
    gap: 16,
  },
  propertyCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
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
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  propertySize: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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
    color: '#64748b',
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