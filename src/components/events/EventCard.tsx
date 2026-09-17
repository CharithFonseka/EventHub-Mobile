// src/components/events/EventCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Event } from '../../types';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface Props {
  event: Event;
  onPress: () => void;
  viewMode?: 'list' | 'grid';
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
}

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - spacing.xl * 2 - spacing.md) / 2;

export default function EventCard({ event, onPress, viewMode = 'list', isFavourite, onToggleFavourite }: Props) {
  const isGrid = viewMode === 'grid';

  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isGrid ? { width: GRID_ITEM_WIDTH, marginBottom: spacing.md } : { width: '100%', marginBottom: spacing.lg },
      ]}
    >
      <View style={[styles.imageContainer, isGrid ? { height: 120 } : { height: 180 }]}>
        <Image
          source={{ uri: event.imageURL || 'https://via.placeholder.com/400x200?text=Event' }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', 'rgba(13, 27, 42, 0.8)']}
          style={styles.imageGradient}
        />
        
        {/* Top badges */}
        <View style={styles.topBadges}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{dateStr}</Text>
          </View>
          {onToggleFavourite && (
            <TouchableOpacity 
              style={styles.favBadge} 
              onPress={onToggleFavourite}
              activeOpacity={0.7}
            >
              <Text style={styles.favIcon}>{isFavourite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom price badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={isGrid ? 2 : 1}>
          {event.title}
        </Text>
        
        {!isGrid && (
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
          </View>
        )}
        
        <View style={styles.footerRow}>
          <Text style={styles.categoryText}>{event.category.toUpperCase()}</Text>
          <Text style={[styles.seatsText, event.availableSeats < 10 && { color: colors.error }]}>
            {event.availableSeats} seats left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topBadges: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  dateBadgeText: {
    color: '#000',
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.xs,
  },
  favBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 16,
  },
  priceBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  priceText: {
    color: colors.textOnPrimary,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.xs,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  seatsText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: typography.fontWeights.medium,
  },
});
