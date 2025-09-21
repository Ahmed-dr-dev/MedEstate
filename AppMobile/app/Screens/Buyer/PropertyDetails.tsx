import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  seller: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - replace with actual API call
  useEffect(() => {
    setProperty({
      id: id as string,
      title: "Modern Medical Office Space",
      description: "Beautiful modern medical office space with state-of-the-art facilities. Perfect for medical practices, dental offices, or healthcare services. Features include modern finishes, ample parking, and excellent location.",
      price: 750000,
      location: "Downtown Medical District",
      images: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
      ],
      bedrooms: 0,
      bathrooms: 3,
      area: 2500,
      seller: {
        name: "Dr. Sarah Johnson",
        phone: "(555) 123-4567",
        email: "sarah.johnson@email.com"
      }
    });
  }, [id]);

  const handleScheduleVisit = () => {
    Alert.alert(
      'Schedule Visit',
      'Would you like to schedule a visit to this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Schedule', onPress: () => Alert.alert('Success', 'Visit request sent to seller!') }
      ]
    );
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite ? 'Property removed from your favorites' : 'Property added to your favorites'
    );
  };

  const handleContactSeller = () => {
    if (property?.seller) {
      Alert.alert(
        'Contact Seller',
        `${property.seller.name}\n${property.seller.phone}\n${property.seller.email}`,
        [
          { text: 'Call', onPress: () => {} },
          { text: 'Email', onPress: () => {} },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with back button and favorite */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.propertyImage} />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicators}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.contentContainer}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Text style={styles.propertyPrice}>${property.price.toLocaleString()}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>
            </View>
          </View>

          <View style={styles.propertyDetails}>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>🛏️</Text>
              <Text style={styles.detailLabel}>Bedrooms</Text>
              <Text style={styles.detailValue}>{property.bedrooms}</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>🚿</Text>
              <Text style={styles.detailLabel}>Bathrooms</Text>
              <Text style={styles.detailValue}>{property.bathrooms}</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>📐</Text>
              <Text style={styles.detailLabel}>Area</Text>
              <Text style={styles.detailValue}>{property.area} sqft</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>
                  {property.seller.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{property.seller.name}</Text>
                <Text style={styles.sellerContact}>{property.seller.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactSeller}
              >
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleVisit}
        >
          <Text style={styles.scheduleButtonText}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSeller}
        >
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    color: '#1e293b',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: width,
    height: 300,
    backgroundColor: '#f1f5f9',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 20,
  },
  propertyHeader: {
    marginBottom: 24,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 30,
  },
  propertyPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#64748b',
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  sellerSection: {
    marginBottom: 32,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  sellerContact: {
    fontSize: 14,
    color: '#64748b',
  },
  contactButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomAction: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contactButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
});