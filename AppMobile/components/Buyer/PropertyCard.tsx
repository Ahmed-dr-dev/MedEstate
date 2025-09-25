import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { API_BASE_URL } from '@/constants/api';

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

interface PropertyCardProps {
  property: Property;
  onLike: (id: string) => void;
  onView: (id: string) => void;
  userId?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLike, onView, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleLike = async () => {
    if (!userId || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/properties/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          property_id: property.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsLiked(result.data.is_saved);
        onLike(property.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.propertyCard}>
      <View style={styles.propertyImageSection}>
        <View style={styles.propertyImageContainer}>
          {property.images && property.images.length > 0 ? (
            <Image 
              source={{ uri: property.images[0] }} 
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🏠</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.likeButton, isLiked && styles.likedButton]}
          onPress={handleLike}
          disabled={isLoading}
        >
          <Text style={[styles.likeIcon, isLiked && styles.likedIcon]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText}>{property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</Text>
        </View>
      </View>
      
      <View style={styles.propertyContent}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📏</Text>
            <Text style={styles.detailText}>{property.area ? `${property.area.toLocaleString()} m²` : 'N/A'}</Text>
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
        
        <Text style={styles.propertyDescription} numberOfLines={2}>
          {property.description || 'No description available'}
        </Text>
      </View>
      
      <View style={styles.propertyFooter}>
        <View style={styles.priceSection}>
          <Text style={styles.propertyPrice}>{property.price.toLocaleString()} TND</Text>
          <Text style={styles.pricePerSqft}>
            {property.area ? `${Math.round(property.price / property.area).toLocaleString()} TND/m²` : ''}
          </Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    height: 380,
  },
  propertyImageSection: {
    position: 'relative',
    height: 180,
    flex: 1,
  },
  propertyImageContainer: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  placeholderText: {
    fontSize: 40,
    opacity: 0.4,
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
  propertyContent: {
    padding: 18,
    flex: 1,
  },
  propertyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 12,
    fontWeight: '500',
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 20,
    marginBottom: 16,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flex: 0,
  },
  priceSection: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  pricePerSqft: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default PropertyCard;
