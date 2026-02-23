import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { WorkerProfile, VerificationBadge } from '../types';
import VerificationBadge from './VerificationBadge';
import StarRating from './StarRating';

interface WorkerCardProps {
  worker: WorkerProfile;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/worker/${worker.id}`);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 528)} ft`;
    }
    return `${distance.toFixed(1)} mi`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Image
          source={
            worker.user.profileImageUrl
              ? { uri: worker.user.profileImageUrl }
              : require('../assets/images/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{worker.user.name}</Text>
            <VerificationBadge badge={worker.verificationBadge} size="small" />
          </View>
          <Text style={styles.category}>{worker.serviceCategory}</Text>
          <Text style={styles.location}>{worker.neighborhood} • {formatDistance(worker.distance || 0)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {worker.hourlyRate && (
          <Text style={styles.rate}>${worker.hourlyRate}/hr</Text>
        )}
        <View style={styles.rating}>
          <StarRating rating={worker.averageRating || 0} size="small" readonly />
          <Text style={styles.ratingText}>
            {worker.averageRating?.toFixed(1) || '0.0'} ({worker.reviewCount || 0})
          </Text>
        </View>
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
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginRight: 8,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A9D8F',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
