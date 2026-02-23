import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2A9D8F',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: user?.role === 'WORKER' ? 'Dashboard' : 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons 
              name={user?.role === 'WORKER' ? 'grid' : 'search'} 
              size={size} 
              color={color} 
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
