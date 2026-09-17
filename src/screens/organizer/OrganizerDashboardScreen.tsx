// src/screens/organizer/OrganizerDashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import GradientButton from '../../components/ui/GradientButton';
import { seedEvents } from '../../utils/seed';

export default function OrganizerDashboardScreen() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedEvents();
    setIsSeeding(false);
    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂️ My Events</Text>
      <Text style={styles.subtitle}>Organizer dashboard — Coming in Stage 7</Text>

      <View style={styles.devCard}>
        <Text style={styles.devTitle}>Development Tools</Text>
        <Text style={styles.devText}>
          Use this button to populate Firestore with sample events. 
          This is useful for testing the Browse Events screen (Stage 3).
        </Text>
        <GradientButton 
          title="Seed Sample Events" 
          onPress={handleSeed}
          isLoading={isSeeding}
          size="sm"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: spacing.xl 
  },
  title: { 
    fontSize: typography.fontSizes.xxl, 
    fontWeight: typography.fontWeights.bold, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm 
  },
  subtitle: { 
    fontSize: typography.fontSizes.md, 
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  devCard: {
    backgroundColor: colors.backgroundCard,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    width: '100%',
  },
  devTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  devText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  }
});
