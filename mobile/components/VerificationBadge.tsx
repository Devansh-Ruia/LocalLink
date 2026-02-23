import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerificationBadge as VerificationBadgeType } from '../types';

interface VerificationBadgeProps {
  badge: VerificationBadgeType;
  size?: 'small' | 'medium';
}

export default function VerificationBadge({ badge, size = 'medium' }: VerificationBadgeProps) {
  const getBadgeInfo = () => {
    switch (badge) {
      case 'NONE':
        return { color: '#ccc', icon: '', label: '' };
      case 'ID_VERIFIED':
        return { color: '#2196F3', icon: '✓', label: 'ID Verified' };
      case 'SKILL_CHECKED':
        return { color: '#4CAF50', icon: '✓', label: 'Skill Checked' };
      case 'FULLY_CERTIFIED':
        return { color: '#FFD700', icon: '★', label: 'Fully Certified' };
      default:
        return { color: '#ccc', icon: '', label: '' };
    }
  };

  if (badge === 'NONE') {
    return null;
  }

  const { color, icon, label } = getBadgeInfo();
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, { backgroundColor: color }, isSmall && styles.containerSmall]}>
      <Text style={[styles.icon, isSmall && styles.iconSmall]}>{icon}</Text>
      {!isSmall && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  icon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  iconSmall: {
    fontSize: 10,
    marginRight: 0,
  },
  label: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
