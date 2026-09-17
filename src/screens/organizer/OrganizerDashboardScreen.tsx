// src/screens/organizer/OrganizerDashboardScreen.tsx
// Placeholder — implemented fully in Stage 7
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export default function OrganizerDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂️ My Events</Text>
      <Text style={styles.subtitle}>Organizer dashboard — Coming in Stage 7</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xxl, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSizes.md, color: colors.textSecondary },
});
