import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI, reviewsAPI } from '../../services/api';
import { BookingRequest } from '../../types';
import StarRating from '../../components/StarRating';

export default function ReviewScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { user } = useAuth();

  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, [bookingId]);

  const loadBookingData = async () => {
    try {
      const response = await bookingsAPI.getBookings();
      const foundBooking = response.bookings.find(b => b.id === bookingId);

      if (!foundBooking) {
        Alert.alert('Error', 'Booking not found');
        router.back();
        return;
      }

      if (foundBooking.status !== 'COMPLETED') {
        Alert.alert('Error', 'You can only review completed bookings');
        router.back();
        return;
      }

      if (foundBooking.customerId !== user?.id) {
        Alert.alert('Error', 'You can only review your own bookings');
        router.back();
        return;
      }

      if (foundBooking.reviews?.length > 0) {
        Alert.alert('Error', 'You have already reviewed this booking');
        router.back();
        return;
      }

      setBooking(foundBooking);
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert('Error', 'Failed to load booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsAPI.createReview({
        bookingId: bookingId!,
        rating,
        comment: comment.trim(),
      });

      Alert.alert(
        'Review Submitted!',
        'Thank you for your feedback.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={styles.loadingText}>Loading booking...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leave a Review</Text>
        <Text style={styles.subtitle}>Share your experience with {booking.worker.user.name}</Text>
      </View>

      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{booking.worker.user.name}</Text>
        <Text style={styles.service}>{booking.serviceCategory}</Text>
        <Text style={styles.date}>
          {new Date(booking.proposedDate).toLocaleDateString()} at {booking.proposedTime}
        </Text>
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>How was your experience?</Text>
        <StarRating
          rating={rating}
          size="large"
          onRatingChange={setRating}
        />
        <Text style={styles.ratingHint}>
          Tap to rate from 1 to 5 stars
        </Text>
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>Tell us more</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Share details about your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[styles.submitButton, (rating === 0 || !comment.trim()) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || !comment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  workerInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
  },
  workerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 4,
  },
  service: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 16,
  },
  ratingHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  commentSection: {
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  commentInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
  },
  submitSection: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#2A9D8F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
