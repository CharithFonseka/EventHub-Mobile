// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { AuthStackParamList, UserRole } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../theme';
import InputField from '../../components/ui/InputField';
import GradientButton from '../../components/ui/GradientButton';
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validatePhone,
  formatFirebaseError,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const ROLES: { label: string; value: UserRole; emoji: string; desc: string }[] = [
  { label: 'Attendee', value: 'attendee', emoji: '🎟️', desc: 'Browse and book events' },
  { label: 'Organizer', value: 'organizer', emoji: '🗂️', desc: 'Create and manage events' },
];

export default function RegisterScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('attendee');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const nameErr = validateDisplayName(displayName);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);

    if (nameErr) newErrors.displayName = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;
    if (passErr) newErrors.password = passErr;
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      // Update Firebase Auth display name
      await updateProfile(user, { displayName: displayName.trim() });

      // Write user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        phone: phone.trim() || null,
        role,
        photoURL: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // RootNavigator picks up auth state change → navigates to Main
    } catch (err: any) {
      const message = formatFirebaseError(err.code);
      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎪</Text>
          </View>
          <Text style={styles.appName}>EventHub</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        {/* Role selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleTitle}>I want to…</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleCard, role === r.value && styles.roleCardActive]}
                onPress={() => setRole(r.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.roleEmoji}>{r.emoji}</Text>
                <Text style={[styles.roleLabel, role === r.value && styles.roleLabelActive]}>
                  {r.label}
                </Text>
                <Text style={styles.roleDesc}>{r.desc}</Text>
                {role === r.value && (
                  <View style={styles.roleCheck}>
                    <Text style={styles.roleCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Your Details</Text>

          <InputField
            label="Full Name"
            value={displayName}
            onChangeText={(t) => { setDisplayName(t); clearError('displayName'); }}
            error={errors.displayName}
            leftIcon="👤"
            placeholder="John Smith"
            returnKeyType="next"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); clearError('email'); }}
            error={errors.email}
            leftIcon="✉️"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            returnKeyType="next"
          />

          <InputField
            label="Phone (optional)"
            value={phone}
            onChangeText={(t) => { setPhone(t); clearError('phone'); }}
            error={errors.phone}
            leftIcon="📱"
            keyboardType="phone-pad"
            placeholder="+94 77 123 4567"
            returnKeyType="next"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); clearError('password'); }}
            error={errors.password}
            leftIcon="🔒"
            isPassword
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            hint="Must have uppercase letter and number"
            returnKeyType="next"
          />

          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
            error={errors.confirmPassword}
            leftIcon="🔒"
            isPassword
            placeholder="Re-enter your password"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <GradientButton
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xl, paddingTop: spacing.huge },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryGlow,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  roleContainer: { marginBottom: spacing.xl },
  roleTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleRow: { flexDirection: 'row', gap: spacing.md },
  roleCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  roleEmoji: { fontSize: 28, marginBottom: spacing.sm },
  roleLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleLabelActive: { color: colors.textPrimary },
  roleDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  roleCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCheckText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  formTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  registerBtn: { marginTop: spacing.md },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  footerText: { color: colors.textSecondary, fontSize: typography.fontSizes.md },
  footerLink: {
    color: colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
});
