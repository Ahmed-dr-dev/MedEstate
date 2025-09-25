import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import { getProfileId } from '@/lib/auth';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
interface PropertyFormData {
  owner_id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  property_type: string;
  images: string[];
}

export default function AddProperty() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PropertyFormData>({
    owner_id: user?.id || '', // Will be set from user context
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    property_type: 'house',
    images: [],
  });

  const propertyTypes = [
    { id: 'house', label: 'House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddImage = () => {
    Alert.alert(
      'Add Image',
      'Select image source',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Error', 'Camera permission is required');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Error', 'Gallery permission is required');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          allowsMultipleSelection: true,
        });
      }

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset.uri);
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const validateForm = () => {
    const { title, description, price, location, bedrooms, bathrooms, area } = formData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a property title');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a property description');
      return false;
    }

    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }

    if (!bedrooms.trim() || isNaN(Number(bedrooms))) {
      Alert.alert('Error', 'Please enter valid number of bedrooms');
      return false;
    }

    if (!bathrooms.trim() || isNaN(Number(bathrooms))) {
      Alert.alert('Error', 'Please enter valid number of bathrooms');
      return false;
    }

    if (!area.trim() || isNaN(Number(area))) {
      Alert.alert('Error', 'Please enter valid area in square feet');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Get current user's profile ID (mock for now)
      const profileId = user?.id || ''; // Replace with actual auth

      // Create FormData to send both property data and images
      const formDataToSend = new FormData();
      formDataToSend.append('owner_id', profileId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('bedrooms', formData.bedrooms);
      formDataToSend.append('bathrooms', formData.bathrooms);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('property_type', formData.property_type);

      // Add images to FormData
      for (let i = 0; i < formData.images.length; i++) {
        const imageUri = formData.images[i];
        formDataToSend.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `image_${i + 1}.jpg`,
        } as any);
      }

      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          'Property Added',
          'Your property has been successfully added to the marketplace!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Post Property 🏠</Text>
            <Text style={styles.subtitle}>List your property for sale</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Property Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="Enter property title"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Describe your property..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.typeContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeOption,
                      formData.property_type === type.id && styles.selectedType
                    ]}
                    onPress={() => handleInputChange('property_type', type.id)}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      formData.property_type === type.id && styles.selectedTypeText
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Area (sqft) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.area}
                  onChangeText={(value) => handleInputChange('area', value)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Bedrooms *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bedrooms}
                  onChangeText={(value) => handleInputChange('bedrooms', value)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Bathrooms *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bathrooms}
                  onChangeText={(value) => handleInputChange('bathrooms', value)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter property location"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Images</Text>
            
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Text style={styles.addImageIcon}>📷</Text>
              <Text style={styles.addImageText}>Add Images</Text>
              <Text style={styles.addImageSubtext}>Tap to add property photos</Text>
            </TouchableOpacity>

            {formData.images.length > 0 && (
              <View style={styles.imagesContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post Property</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#475569',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeOption: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  selectedType: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeOptionText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: 'white',
  },
  addImageButton: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
    borderStyle: 'dashed',
  },
  addImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  addImageSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  imageItem: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#475569',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});

