import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { bookingsAPI } from '../../services/api';
import { BookingRequest, BookingStatus } from '../../types';
import BookingCard from '../../components/BookingCard';

const tabs = ['Pending', 'Upcoming', 'Past'] as const;

export default function BookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Pending');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getBookings();
      const allBookings = response.bookings;

      let filteredBookings: BookingRequest[] = [];

      if (user?.role === 'CUSTOMER') {
        switch (activeTab) {
          case 'Pending':
            filteredBookings = allBookings.filter(b => b.status === 'PENDING');
            break;
          case 'Upcoming':
            filteredBookings = allBookings.filter(b => b.status === 'ACCEPTED');
            break;
          case 'Past':
            filteredBookings = allBookings.filter(b => 
              ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status)
            );
            break;
        }
      } else if (user?.role === 'WORKER') {
        switch (activeTab) {
          case 'Pending':
            filteredBookings = allBookings.filter(b => b.status === 'PENDING');
            break;
          case 'Upcoming':
            filteredBookings = allBookings.filter(b => b.status === 'ACCEPTED');
            break;
          case 'Past':
            filteredBookings = allBookings.filter(b => 
              ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status)
            );
            break;
        }
      }

      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabButton = (tab: typeof tabs[number]) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(renderTabButton)}
      </View>

      <ScrollView style={styles.bookingsContainer}>
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} bookings
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole={user?.role || 'CUSTOMER'}
            />
          ))
        )}
      </ScrollView>
    </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#264653',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#2A9D8F',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: 'white',
  },
  bookingsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
