import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';
import { ServiceCategory } from '../../types';

export default function BookWorkerScreen() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams<{ workerId: string }>();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    message: '',
    proposedDate: '',
    proposedTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.message || !formData.proposedDate || !formData.proposedTime) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user || user.role !== 'CUSTOMER') {
      Alert.alert('Error', 'Only customers can request bookings');
      return;
    }

    setIsLoading(true);
    try {
      await bookingsAPI.createBooking({
        workerId: workerId!,
        serviceCategory: 'OTHER' as ServiceCategory,
        message: formData.message,
        proposedDate: formData.proposedDate,
        proposedTime: formData.proposedTime,
      });

      Alert.alert(
        'Booking Request Sent!',
        'Your request has been sent to the worker. You will be notified when they respond.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send booking request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Booking</Text>
        <Text style={styles.subtitle}>Send a booking request to this worker</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you need help with..."
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proposed Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={formData.proposedDate}
            onChangeText={(text) => setFormData({ ...formData, proposedDate: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proposed Time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2:00 PM"
            value={formData.proposedTime}
            onChangeText={(text) => setFormData({ ...formData, proposedTime: text })}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Send Request</Text>
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
  form: {
    paddingHorizontal: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 8,
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
  submitButton: {
    backgroundColor: '#2A9D8F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
