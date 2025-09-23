import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  size: string;
  type: string;
  description: string;
  features: string[];
  image: string;
  isLiked: boolean;
  images?: string[];
}

interface PropertyCardProps {
  property: Property;
  onLike: (id: string) => void;
  onView: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLike, onView }) => {
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
          style={styles.likeButton}
          onPress={() => onLike(property.id)}
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
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <Text style={styles.propertySize}>
          📏 {property.size}
        </Text>
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
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    height: 400,
  },
  propertyImageSection: {
    position: 'relative',
    height: 200,
    flex: 1,
  },
  propertyImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.5,
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 18,
  },
  likedIcon: {
    fontSize: 20,
  },
  propertyTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyContent: {
    padding: 16,
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  propertySize: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  featureText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flex: 0,
  },
  priceSection: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 2,
  },
  pricePerSqft: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PropertyCard;
