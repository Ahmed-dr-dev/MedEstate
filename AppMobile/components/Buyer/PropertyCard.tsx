import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  images: { uri: string }[];
  owner: {
    display_name: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

interface PropertyCardProps {
  property: Property;
  onLike: (id: string) => void;
  onView: (id: string) => void;
  userId?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLike, onView, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if property is already liked from local storage
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!userId) return;
      
      try {
        const savedProperties = await AsyncStorage.getItem('savedProperties');
        const likedProperties = savedProperties ? JSON.parse(savedProperties) : [];
        const isPropertySaved = likedProperties.includes(property.id);
        setIsLiked(isPropertySaved);
      } catch (error) {
        console.error('Error checking like status:', error);
        setIsLiked(false);
      }
    };

    checkLikeStatus();
  }, [property.id, userId]);

  const handleLike = async () => {
    if (!userId || isLoading) return;
    
    setIsLoading(true);
    try {
      // Get current saved properties from AsyncStorage
      const savedProperties = await AsyncStorage.getItem('savedProperties');
      const likedProperties = savedProperties ? JSON.parse(savedProperties) : [];
      
      if (isLiked) {
        // Remove from saved properties
        const updatedProperties = likedProperties.filter((id: string) => id !== property.id);
        await AsyncStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
        setIsLiked(false);
      } else {
        // Add to saved properties
        const updatedProperties = [...likedProperties, property.id];
        await AsyncStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
        setIsLiked(true);
      }
      
      onLike(property.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M TND`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K TND`;
    }
    return `${price.toLocaleString()} TND`;
  };

  return (
    <View style={styles.propertyCard}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {property.images && property.images.length > 0 && !imageError ? (
          <Image 
            source={{ uri: property.images[0].uri }} 
            style={styles.propertyImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
            onLoadStart={() => setImageError(false)}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🏠</Text>
            <Text style={styles.placeholderText}>Property Image</Text>
          </View>
        )}
        
        {/* Like Button */}
        <TouchableOpacity
          style={[styles.likeButton, isLiked && styles.likedButton]}
          onPress={handleLike}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isLiked ? "#ef4444" : "#fff"} />
          ) : (
            <Text style={styles.likeIcon}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Property Type Badge */}
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText}>
            {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
          </Text>
        </View>
      </View>
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.title}
        </Text>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        
        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📏</Text>
            <Text style={styles.detailText}>
              {property.area ? `${property.area.toLocaleString()} m²` : 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🛏️</Text>
            <Text style={styles.detailText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🚿</Text>
            <Text style={styles.detailText}>{property.bathrooms}</Text>
          </View>
        </View>
        
        <Text style={styles.propertyDescription} numberOfLines={3}>
          {property.description || 'No description available'}
        </Text>
      </View>
      
      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
          {property.area && (
            <Text style={styles.pricePerSqft}>
              {Math.round(property.price / property.area).toLocaleString()} TND/m²
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onView(property.id)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.6,
  },
  placeholderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  likedButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  likeIcon: {
    fontSize: 20,
  },
  propertyTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  propertyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceContainer: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  pricePerSqft: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default PropertyCard;