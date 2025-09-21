import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { BuyerBottomNav } from '../../../components/BuyerBottomNav';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
}

export default function BrowseProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'house', label: 'House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const priceFilters = [
    { id: 'any', label: 'Any Price' },
    { id: 'under_500k', label: 'Under $500K' },
    { id: '500k_1m', label: '$500K - $1M' },
    { id: 'over_1m', label: 'Over $1M' },
  ];

  const renderProperty = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => router.push(`/Screens/Buyer/PropertyDetails?id=${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.images[0] || 'https://via.placeholder.com/300x200' }} 
          style={styles.propertyImage} 
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${(item.price / 1000).toFixed(0)}K</Text>
        </View>
      </View>
      
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>{item.location}</Text>
        
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🛏️</Text>
            <Text style={styles.detailText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🚿</Text>
            <Text style={styles.detailText}>{item.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📐</Text>
            <Text style={styles.detailText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning! 👋</Text>
          <Text style={styles.title}>Find Your Perfect Property</Text>
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

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.activeFilterButtonText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Properties Grid */}
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.propertiesList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.propertyRow}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          </View>
        )}
      />

      <BuyerBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filtersSection: {
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filtersContainer: {
    paddingLeft: 20,
  },
  filterButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  propertiesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  propertyRow: {
    justifyContent: 'space-between',
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 20,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});