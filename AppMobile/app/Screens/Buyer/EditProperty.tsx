import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '../../../constants/api';
import { useAuth } from '../../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

interface PropertyFormData {
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

export default function EditProperty() {
  const router = useRouter();
  const { user } = useAuth();
  const { propertyId } = useLocalSearchParams();
  
  const [formData, setFormData] = useState<PropertyFormData>({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const propertyTypes = [
    { id: 'house', label: 'House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'villa', label: 'Villa' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'land', label: 'Land' },
  ];

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const property = result.data;
        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price?.toString() || '',
          location: property.location || '',
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area?.toString() || '',
          property_type: property.property_type || 'house',
          images: property.images || [],
        });
      } else {
        Alert.alert('Error', 'Failed to load property details');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      Alert.alert('Error', 'Failed to load property details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a property title');
      return;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    if (!propertyId) {
      Alert.alert('Error', 'Property ID not found');
      return;
    }

    setSaving(true);

    try {
      console.log('Updating property:', propertyId, 'for user:', user.id);

      const formDataToSubmit = new FormData();
      
      // Add form fields
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('price', formData.price);
      formDataToSubmit.append('location', formData.location);
      formDataToSubmit.append('bedrooms', formData.bedrooms);
      formDataToSubmit.append('bathrooms', formData.bathrooms);
      formDataToSubmit.append('area', formData.area);
      formDataToSubmit.append('property_type', formData.property_type);

      // Add images array as JSON string
      formDataToSubmit.append('images', JSON.stringify(formData.images));

      const response = await fetch(`${API_BASE_URL}/properties/my-properties?property_id=${propertyId}&owner_id=${user.id}`, {
        method: 'PUT',
        body: formDataToSubmit,
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Update result:', result);

      if (result.success) {
        Alert.alert(
          'Success',
          'Property updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/Screens/Buyer/MyProperties'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading property details...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Property</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Property Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(value) => setFormData(prev => ({ ...prev, title: value }))}
                placeholder="Enter property title"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Describe your property"
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Price (د.ت) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, price: value }))}
                  placeholder="Enter price"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Property Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeOption,
                        formData.property_type === type.id && styles.typeOptionSelected,
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, property_type: type.id }))}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        formData.property_type === type.id && styles.typeOptionTextSelected,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => setFormData(prev => ({ ...prev, location: value }))}
                placeholder="Enter property location"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.thirdWidth]}>
                <Text style={styles.inputLabel}>Bedrooms</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bedrooms}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}
                  placeholder="0"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.thirdWidth]}>
                <Text style={styles.inputLabel}>Bathrooms</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bathrooms}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}
                  placeholder="0"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.thirdWidth]}>
                <Text style={styles.inputLabel}>Area (sq ft)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.area}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, area: value }))}
                  placeholder="0"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Images</Text>
            
            <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
              <Text style={styles.imageUploadIcon}>📷</Text>
              <Text style={styles.imageUploadText}>Add Images</Text>
            </TouchableOpacity>
            
            {formData.images.length > 0 && (
              <View style={styles.imagesContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.uploadedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, saving && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.submitButtonText}>
              {saving ? 'Updating...' : 'Update Property'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 60,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#64748b',
    color: '#f8fafc',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  typeSelector: {
    marginTop: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#64748b',
    backgroundColor: '#475569',
    marginRight: 8,
  },
  typeOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: 'white',
  },
  imageUploadButton: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#64748b',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageUploadIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#64748b',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
