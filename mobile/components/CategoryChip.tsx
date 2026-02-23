import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ServiceCategory } from '../types';

interface CategoryChipProps {
  category: ServiceCategory | 'All';
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryChip({ category, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>
        {category}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  selectedContainer: {
    backgroundColor: '#2A9D8F',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedText: {
    color: 'white',
  },
});
