import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Log In' }} />
      <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="onboarding" options={{ title: 'Complete Profile', headerBackVisible: false }} />
    </Stack>
  );
}
