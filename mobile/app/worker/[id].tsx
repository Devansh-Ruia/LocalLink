import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { workersAPI, reviewsAPI, bookingsAPI } from '../../services/api';
import { WorkerProfile, Review, UserRole } from '../../types';
import StarRating from '../../components/StarRating';
import VerificationBadge from '../../components/VerificationBadge';
import ReviewCard from '../../components/ReviewCard';

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkerData();
  }, [id]);

  const loadWorkerData = async () => {
    try {
      const [workerResponse, reviewsResponse] = await Promise.all([
        workersAPI.getWorker(id),
        reviewsAPI.getWorkerReviews(id),
      ]);

      setWorker(workerResponse.worker);
      setReviews(reviewsResponse.reviews);
    } catch (error) {
      console.error('Error loading worker data:', error);
      Alert.alert('Error', 'Failed to load worker profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestBooking = () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      Alert.alert('Error', 'Only customers can request bookings');
      return;
    }

    router.push(`/book/${id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Worker not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            worker.user.profileImageUrl
              ? { uri: worker.user.profileImageUrl }
              : require('../../assets/images/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{worker.user.name}</Text>
            <VerificationBadge badge={worker.verificationBadge} />
          </View>
          <Text style={styles.category}>{worker.serviceCategory}</Text>
          <Text style={styles.location}>{worker.neighborhood}</Text>
          {worker.hourlyRate && (
            <Text style={styles.rate}>${worker.hourlyRate}/hour</Text>
          )}
        </View>
      </View>

      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <StarRating rating={worker.averageRating || 0} size="large" readonly />
          <Text style={styles.ratingText}>
            {worker.averageRating?.toFixed(1) || '0.0'} ({worker.reviewCount || 0} reviews)
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{worker.bio}</Text>
      </View>

      {worker.availabilityNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.availability}>{worker.availabilityNotes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Area</Text>
        <Text style={styles.serviceArea}>
          Serves within {worker.radiusMiles} miles of {worker.neighborhood}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet</Text>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </View>

      {user?.role === 'CUSTOMER' && (
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.bookButton} onPress={handleRequestBooking}>
            <Text style={styles.bookButtonText}>Request Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#264653',
    marginRight: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A9D8F',
  },
  ratingSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  availability: {
    fontSize: 16,
    color: '#333',
  },
  serviceArea: {
    fontSize: 16,
    color: '#333',
  },
  noReviews: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  actionSection: {
    padding: 20,
    paddingBottom: 40,
  },
  bookButton: {
    backgroundColor: '#2A9D8F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
