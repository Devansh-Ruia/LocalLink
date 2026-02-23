import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { workersAPI } from '../../services/api';
import { ServiceCategory } from '../../types';

const serviceCategories = [
  'BABYSITTING',
  'TUTORING', 
  'HANDYMAN',
  'CLEANING',
  'LANDSCAPING',
  'PET_CARE',
  'OTHER'
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { location } = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    bio: '',
    serviceCategory: 'OTHER' as ServiceCategory,
    hourlyRate: '',
    availabilityNotes: '',
    neighborhood: '',
    radiusMiles: '5',
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!profileData.bio || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await workersAPI.createProfile({
        bio: profileData.bio,
        serviceCategory: profileData.serviceCategory,
        hourlyRate: profileData.hourlyRate ? parseFloat(profileData.hourlyRate) : undefined,
        locationLat: location.latitude,
        locationLng: location.longitude,
        neighborhood: profileData.neighborhood || 'Unknown',
        radiusMiles: parseFloat(profileData.radiusMiles),
        availabilityNotes: profileData.availabilityNotes || undefined,
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>What services do you offer?</Text>
      
      <TextInput
        style={styles.textArea}
        placeholder="Describe your experience, skills, and what makes you great at what you do..."
        value={profileData.bio}
        onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
        multiline
        numberOfLines={4}
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.label}>Service Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesRow}>
            {serviceCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  profileData.serviceCategory === category && styles.selectedCategory
                ]}
                onPress={() => setProfileData({ ...profileData, serviceCategory: category as ServiceCategory })}
              >
                <Text style={[
                  styles.categoryText,
                  profileData.serviceCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pricing & Availability</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hourly Rate (USD) - Optional</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25"
          value={profileData.hourlyRate}
          onChangeText={(text) => setProfileData({ ...profileData, hourlyRate: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Availability Notes - Optional</Text>
        <TextInput
          style={styles.textArea}
          placeholder="When are you typically available? Any preferences?"
          value={profileData.availabilityNotes}
          onChangeText={(text) => setProfileData({ ...profileData, availabilityNotes: text })}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Service Area</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Neighborhood</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Back Bay, Cambridge"
          value={profileData.neighborhood}
          onChangeText={(text) => setProfileData({ ...profileData, neighborhood: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Radius (miles)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5"
          value={profileData.radiusMiles}
          onChangeText={(text) => setProfileData({ ...profileData, radiusMiles: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          📍 Using your current location
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profile Photo</Text>
      <Text style={styles.stepSubtitle}>Add a photo to build trust (Optional)</Text>
      
      <TouchableOpacity style={styles.photoUpload}>
        <Text style={styles.photoUploadText}>+ Add Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleComplete}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressBar}>
      {[1, 2, 3, 4].map((step) => (
        <View
          key={step}
          style={[
            styles.progressStep,
            step <= currentStep && styles.activeStep
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity
            style={[styles.nextButton, !profileData.bio && styles.disabledButton]}
            onPress={handleNext}
            disabled={!profileData.bio}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.completeButtonText}>Complete Profile</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: '#2A9D8F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  stepContainer: {
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  categoryContainer: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#2A9D8F',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationInfo: {
    backgroundColor: '#E8F4F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  locationText: {
    color: '#2A9D8F',
    fontSize: 14,
    textAlign: 'center',
  },
  photoUpload: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2A9D8F',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  photoUploadText: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    gap: 16,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2A9D8F',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2A9D8F',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
