import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';
import { BookingRequest, Message, UserRole } from '../../types';
import MessageBubble from '../../components/MessageBubble';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, [id]);

  const loadBookingData = async () => {
    try {
      const [bookingsResponse] = await Promise.all([
        bookingsAPI.getBookings(),
      ]);

      const allBookings = bookingsResponse.bookings;
      const foundBooking = allBookings.find(b => b.id === id);

      if (!foundBooking) {
        Alert.alert('Error', 'Booking not found');
        router.back();
        return;
      }

      setBooking(foundBooking);

      if (['ACCEPTED', 'COMPLETED'].includes(foundBooking.status)) {
        loadMessages();
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert('Error', 'Failed to load booking');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await bookingsAPI.getBookingMessages(id);
      setMessages(response.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookingData();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await bookingsAPI.updateBookingStatus(id, newStatus);
      setBooking(response.booking);

      if (newStatus === 'COMPLETED') {
        Alert.alert(
          'Booking Completed!',
          'You can now leave a review for this service.',
          [
            {
              text: 'Leave Review',
              onPress: () => router.push(`/review/${id}`),
            },
            {
              text: 'Later',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update booking');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await bookingsAPI.sendMessage(id, { text: newMessage });
      setMessages([...messages, response.message]);
      setNewMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const canSendMessage = booking && ['ACCEPTED', 'COMPLETED'].includes(booking.status);
  const isWorker = user?.role === 'WORKER';
  const isCustomer = user?.role === 'CUSTOMER';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
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

  const otherParty = isWorker ? booking.customer : booking.worker.user;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.partyInfo}>
            <Text style={styles.partyName}>{otherParty.name}</Text>
            <Text style={styles.service}>{booking.serviceCategory}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailTitle}>Booking Details</Text>
          <Text style={styles.detail}>📅 {new Date(booking.proposedDate).toLocaleDateString()} at {booking.proposedTime}</Text>
          <Text style={styles.detail}>💬 {booking.message}</Text>
        </View>

        {canSendMessage && (
          <View style={styles.messagesSection}>
            <Text style={styles.messagesTitle}>Messages</Text>
            <View style={styles.messagesList}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} currentUser={user!} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {booking.status === 'PENDING' && isWorker && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={() => handleStatusUpdate('DECLINED')}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleStatusUpdate('ACCEPTED')}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'ACCEPTED' && isWorker && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusUpdate('COMPLETED')}
          >
            <Text style={styles.completeButtonText}>Mark Completed</Text>
          </TouchableOpacity>
        )}

        {['PENDING', 'ACCEPTED'].includes(booking.status) && isCustomer && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleStatusUpdate('CANCELLED')}
          >
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'COMPLETED' && isCustomer && !booking.reviews?.length && (
          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton]}
            onPress={() => router.push(`/review/${id}`)}
          >
            <Text style={styles.reviewButtonText}>Leave Review</Text>
          </TouchableOpacity>
        )}

        {canSendMessage && (
          <View style={styles.messageInput}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
            >
              <Text style={styles.sendButtonText}>
                {isSending ? '...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return '#FFA500';
    case 'ACCEPTED': return '#4CAF50';
    case 'COMPLETED': return '#2196F3';
    case 'DECLINED': return '#F44336';
    case 'CANCELLED': return '#9E9E9E';
    default: return '#666';
  }
};

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
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  partyInfo: {
    flex: 1,
  },
  partyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 4,
  },
  service: {
    fontSize: 16,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  details: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  messagesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 16,
  },
  messagesList: {
    gap: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  declineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: '#E9C46A',
  },
  reviewButtonText: {
    color: '#264653',
    fontSize: 16,
    fontWeight: '600',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2A9D8F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
