import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  size = 'medium', 
  readonly = false, 
  onRatingChange 
}: StarRatingProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { starSize: 16, containerStyle: styles.containerSmall };
      case 'large':
        return { starSize: 32, containerStyle: styles.containerLarge };
      default:
        return { starSize: 24, containerStyle: styles.containerMedium };
    }
  };

  const { starSize, containerStyle } = getSizeStyles();

  const handleStarPress = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (starNumber: number) => {
    const filled = starNumber <= rating;
    const starColor = filled ? '#E9C46A' : '#E0E0E0';

    const Star = () => (
      <Text style={[styles.star, { fontSize: starSize, color: starColor }]}>
        {filled ? '★' : '☆'}
      </Text>
    );

    if (readonly) {
      return <Star key={starNumber} />;
    }

    return (
      <TouchableOpacity
        key={starNumber}
        onPress={() => handleStarPress(starNumber)}
        style={styles.starButton}
      >
        <Star />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerSmall: {
    gap: 2,
  },
  containerMedium: {
    gap: 4,
  },
  containerLarge: {
    gap: 6,
  },
  starButton: {
    padding: 2,
  },
  star: {
    textAlign: 'center',
  },
});
