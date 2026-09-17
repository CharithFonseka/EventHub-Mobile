// src/screens/bookings/BookingFlowScreen.tsx
// Placeholder — implemented fully in Stage 5
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export default function BookingFlowScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Event</Text>
      <Text style={styles.subtitle}>Booking flow — Coming in Stage 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xxl, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSizes.md, color: colors.textSecondary },
});
