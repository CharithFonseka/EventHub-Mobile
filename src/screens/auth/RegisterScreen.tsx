// src/screens/auth/RegisterScreen.tsx
// Placeholder — implemented fully in Stage 1
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { colors, typography, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎪 EventHub</Text>
      <Text style={styles.subtitle}>Register — Coming in Stage 1</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xxxl, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSizes.md, color: colors.textSecondary, marginBottom: spacing.xxl },
  btn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: 30 },
  btnText: { color: colors.textOnPrimary, fontWeight: '700', fontSize: typography.fontSizes.md },
});
