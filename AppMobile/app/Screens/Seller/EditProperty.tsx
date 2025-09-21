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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface PropertyFormData {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  propertyType: string;
  status: 'active' | 'pending' | 'sold';
  images: string[];
}

export default function EditProperty() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState<PropertyFormData>({
    id: '',
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'house',
    status: 'active',
    images: [],
  });

  const propertyTypes = [
    { id: 'house', label: 'House' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'condo', label: 'Condo' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const statusOptions = [
    { id: 'active', label: 'Active', color: '#10b981' },
    { id: 'pending', label: 'Pending', color: '#f59e0b' },
    { id: 'sold', label: 'Sold', color: '#6b7280' },
  ];

  useEffect(() => {
    // In a real app, fetch property data by ID
    // For now, we'll use mock data
    setFormData({
      id: id as string,
      title: 'Modern Medical Office',
      description: 'Beautiful modern medical office space with state-of-the-art facilities...',
      price: '750000',
      location: 'Downtown Medical District',
      bedrooms: '0',
      bathrooms: '3',
      area: '2500',
      propertyType: 'commercial',
      status: 'active',
      images: [],
    });
  }, [id]);

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
        { text: 'Camera', onPress: () => {} },
        { text: 'Gallery', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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

  const handleSave = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Property Updated',
      'Your property has been successfully updated!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Property Deleted', 'Property has been deleted successfully!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edit Property</Text>
          <Text style={styles.subtitle}>Update your property details</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
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
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your property..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                    formData.propertyType === type.id && styles.selectedType
                  ]}
                  onPress={() => handleInputChange('propertyType', type.id)}
                >
                  <Text style={[
                    styles.typeOptionText,
                    formData.propertyType === type.id && styles.selectedTypeText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.statusOption,
                    formData.status === status.id && { backgroundColor: status.color + '40', borderColor: status.color }
                  ]}
                  onPress={() => handleInputChange('status', status.id)}
                >
                  <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                  <Text style={[
                    styles.statusOptionText,
                    formData.status === status.id && { color: status.color }
                  ]}>
                    {status.label}
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
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Images</Text>
          
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
            <Text style={styles.addImageIcon}>📷</Text>
            <Text style={styles.addImageText}>Add More Images</Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedType: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOptionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  addImageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  addImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  addImageSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
