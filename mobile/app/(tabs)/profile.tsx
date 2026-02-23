import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import VerificationBadge from '../../components/VerificationBadge';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    if (user?.role === 'WORKER') {
      router.push('/(auth)/onboarding');
    }
  };

  const handleRequestVerification = () => {
    Alert.alert(
      'Request Verification',
      'Verification requests will be reviewed by our team. You will be notified once approved.',
      [
        {
          text: 'OK',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            user?.profileImageUrl
              ? { uri: user.profileImageUrl }
              : require('../../assets/images/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.role}>{user?.role}</Text>
          {user?.workerProfile && (
            <VerificationBadge badge={user.workerProfile.verificationBadge} />
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {user?.role === 'WORKER' && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRequestVerification}>
              <Text style={styles.actionButtonText}>Request Verification</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>LocalLink v1.0.0</Text>
        <Text style={styles.footerText}>Find trusted local help in your neighborhood</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '500',
  },
  actions: {
    padding: 32,
    gap: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderWidth: 0,
  },
  logoutButtonText: {
    color: 'white',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  version: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
