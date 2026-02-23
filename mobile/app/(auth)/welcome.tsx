import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { UserRole } from '../../types';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    router.push({
      pathname: '/(auth)/register',
      params: { role }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LocalLink</Text>
        <Text style={styles.tagline}>Find trusted local help in your neighborhood</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.customerButton]}
          onPress={() => handleRoleSelect('CUSTOMER')}
        >
          <Text style={[styles.buttonText, styles.customerButtonText]}>
            I need services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.workerButton]}
          onPress={() => handleRoleSelect('WORKER')}
        >
          <Text style={[styles.buttonText, styles.workerButtonText]}>
            I offer services
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#264653',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 20,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  customerButton: {
    backgroundColor: '#2A9D8F',
  },
  workerButton: {
    backgroundColor: '#E9C46A',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  customerButtonText: {
    color: 'white',
  },
  workerButtonText: {
    color: '#264653',
  },
});
