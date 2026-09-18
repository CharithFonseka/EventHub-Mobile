// src/screens/bookings/BookingConfirmationScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BrowseStackParamList } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../theme';
import GradientButton from '../../components/ui/GradientButton';
import { notifyBookingConfirmed } from '../../utils/notifications';

type Props = NativeStackScreenProps<BrowseStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ route, navigation }: Props) {
  const { bookingId, eventTitle } = route.params;

  useEffect(() => {
    // Show local notification
    notifyBookingConfirmed(eventTitle, bookingId);
  }, [eventTitle, bookingId]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎉</Text>
        </View>
        
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>
          Your booking was successful. Your booking reference is:
        </Text>
        
        <View style={styles.referenceBox}>
          <Text style={styles.referenceText}>{bookingId}</Text>
        </View>

        <Text style={styles.infoText}>
          You can view your tickets and manage this booking anytime from the Bookings tab.
        </Text>
      </View>

      <View style={styles.actions}>
        <GradientButton 
          title="View My Tickets" 
          onPress={() => {
            // Navigate back to the root of the tab navigator, then switch tabs
            navigation.getParent()?.navigate('BookingsTab');
          }}
          style={styles.btn}
        />
        <GradientButton 
          title="Browse More Events" 
          variant="outline"
          onPress={() => navigation.navigate('EventList')}
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.success,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  referenceBox: {
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.xl,
  },
  referenceText: {
    fontSize: typography.fontSizes.lg,
    color: colors.primaryLight,
    fontWeight: typography.fontWeights.mono,
    letterSpacing: 2,
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed,
  },
  actions: {
    gap: spacing.md,
  },
  btn: {
    width: '100%',
  },
});
