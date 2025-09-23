import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PropertyDetails as PropertyDetailsComponent } from '../../../components';

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

  useEffect(() => {
    // Mock property data - replace with actual API call
    setProperty({
      id: id as string,
      title: "Modern Luxury Villa",
      description: "This stunning modern villa offers the perfect blend of luxury and comfort. Featuring an open-concept design, high-end finishes, and breathtaking views, this property is ideal for those seeking an upscale lifestyle.",
      price: 850000,
      location: "Beverly Hills, CA",
      images: [
        'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Exterior',
        'https://via.placeholder.com/400x300/10b981/ffffff?text=Living+Room',
        'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Kitchen',
        'https://via.placeholder.com/400x300/ef4444/ffffff?text=Master+Bedroom',
        'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Pool+Area',
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      seller: {
        name: "Dr. Sarah Johnson",
        phone: "(555) 123-4567",
        email: "sarah.johnson@email.com"
      }
    });
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleLike = (id: string) => {
    setIsFavorite(!isFavorite);
  };

  const handleContact = (agent: any) => {
    console.log('Contact agent:', agent);
  };

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <PropertyDetailsComponent
      property={{
        ...property,
        isLiked: isFavorite,
        image: property.images[0],
        images: property.images,
        agent: property.seller,
        type: 'Villa',
        size: `${property.area} sq ft`,
        features: ['Swimming Pool', 'Garden', 'Garage', 'Security System', 'Modern Kitchen', 'Master Suite']
      }}
      onLike={handleLike}
      onContact={handleContact}
      onClose={handleBack}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
});