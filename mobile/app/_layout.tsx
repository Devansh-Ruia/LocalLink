import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="worker/[id]" options={{ title: 'Worker Profile' }} />
        <Stack.Screen name="book/[workerId]" options={{ title: 'Request Booking' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Booking Details' }} />
        <Stack.Screen name="review/[bookingId]" options={{ title: 'Leave Review' }} />
      </Stack>
    </AuthProvider>
  );
}
