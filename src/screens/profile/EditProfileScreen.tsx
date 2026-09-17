// src/screens/profile/EditProfileScreen.tsx
// Placeholder — implemented fully in Stage 1
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Edit Profile</Text>
      <Text style={styles.subtitle}>Edit profile — Coming in Stage 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xxl, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSizes.md, color: colors.textSecondary },
});
