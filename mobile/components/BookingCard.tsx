import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BookingRequest, BookingStatus } from '../types';

interface BookingCardProps {
  booking: BookingRequest;
  userRole: 'CUSTOMER' | 'WORKER';
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/booking/${booking.id}`);
  };

  const getOtherParty = () => {
    if (userRole === 'CUSTOMER') {
      return {
        name: booking.worker.user.name,
        profileImageUrl: booking.worker.user.profileImageUrl,
      };
    } else {
      return {
        name: booking.customer.name,
        profileImageUrl: booking.customer.profileImageUrl,
      };
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'PENDING':
        return '#FFA500';
      case 'ACCEPTED':
        return '#4CAF50';
      case 'COMPLETED':
        return '#2196F3';
      case 'DECLINED':
        return '#F44336';
      case 'CANCELLED':
        return '#9E9E9E';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const otherParty = getOtherParty();

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name}>{otherParty.name}</Text>
          <Text style={styles.service}>{booking.serviceCategory}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>
          📅 {formatDate(booking.proposedDate)} at {booking.proposedTime}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          💬 {booking.message}
        </Text>
      </View>
    </TouchableOpacity>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  details: {
    gap: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
