import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { workersAPI } from '../../services/api';
import { WorkerProfile, ServiceCategory } from '../../types';
import WorkerCard from '../../components/WorkerCard';
import CategoryChip from '../../components/CategoryChip';

const categories: (ServiceCategory | 'All')[] = [
  'All',
  'BABYSITTING',
  'TUTORING',
  'HANDYMAN',
  'CLEANING',
  'LANDSCAPING',
  'PET_CARE',
  'OTHER'
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { location, isLoading: locationLoading, error: locationError } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchWorkers = async () => {
    if (!location) return;

    setIsLoading(true);
    try {
      const params: any = {
        lat: location.latitude,
        lng: location.longitude,
        radius: 10,
      };

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (verifiedOnly) {
        params.verifiedOnly = true;
      }

      const response = await workersAPI.searchWorkers(params);
      setWorkers(response.workers);
    } catch (error) {
      console.error('Error searching workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await searchWorkers();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (location) {
      searchWorkers();
    }
  }, [location, selectedCategory, verifiedOnly]);

  const filteredWorkers = workers.filter(worker =>
    worker.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role === 'WORKER') {
    return <WorkerDashboard />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Local Help</Text>
        <Text style={styles.subtitle}>
          {locationError ? 'Using default location' : 'Near you'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or neighborhood..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, verifiedOnly && styles.filterButtonActive]}
          onPress={() => setVerifiedOnly(!verifiedOnly)}
        >
          <Text style={[styles.filterText, verifiedOnly && styles.filterTextActive]}>
            Verified only
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.workersContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {locationLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A9D8F" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A9D8F" />
            <Text style={styles.loadingText}>Finding workers...</Text>
          </View>
        ) : filteredWorkers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All' || verifiedOnly
                ? 'No workers found matching your filters'
                : 'No workers found nearby. Try expanding your search.'}
            </Text>
          </View>
        ) : (
          filteredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function WorkerDashboard() {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [stats, setStats] = useState({ completed: 0, averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsResponse] = await Promise.all([
        // bookingsAPI.getBookings(),
      ]);
      
      // const allBookings = bookingsResponse.bookings;
      // const pending = allBookings.filter(b => b.status === 'PENDING');
      // const upcoming = allBookings.filter(b => b.status === 'ACCEPTED');
      // const completed = allBookings.filter(b => b.status === 'COMPLETED');
      
      // setIncomingRequests(pending);
      // setUpcomingJobs(upcoming);
      // setStats({
      //   completed: completed.length,
      //   averageRating: 0,
      //   totalReviews: 0
      // });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, {user?.name}!</Text>
        <Text style={styles.subtitle}>Your service dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed Jobs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>Total Reviews</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incoming Requests</Text>
        {incomingRequests.length === 0 ? (
          <Text style={styles.emptyText}>No pending requests</Text>
        ) : (
          incomingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <Text style={styles.requestText}>New booking request</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
        {upcomingJobs.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming jobs</Text>
        ) : (
          upcomingJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <Text style={styles.jobText}>Upcoming job</Text>
            </View>
          ))
        )}
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#264653',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  filterButtonActive: {
    backgroundColor: '#2A9D8F',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
  },
  workersContainer: {
    flex: 1,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  requestText: {
    fontSize: 16,
    color: '#264653',
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  jobText: {
    fontSize: 16,
    color: '#264653',
  },
});
