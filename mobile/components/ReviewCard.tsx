import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reviewerName}>{review.reviewer.name}</Text>
        <StarRating rating={review.rating} size="small" readonly />
      </View>
      
      <Text style={styles.comment}>{review.comment}</Text>
      
      <Text style={styles.date}>
        {review.booking?.serviceCategory && (
          <Text style={styles.service}>{review.booking.serviceCategory} • </Text>
        )}
        {formatDate(review.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  service: {
    color: '#2A9D8F',
    fontWeight: '500',
  },
});
