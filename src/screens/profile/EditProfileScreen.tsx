// src/screens/profile/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { ProfileStackParamList } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '../../theme';
import InputField from '../../components/ui/InputField';
import GradientButton from '../../components/ui/GradientButton';
import { validateDisplayName, validatePhone } from '../../utils/validation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { userProfile, refreshUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName ?? '');
  const [phone, setPhone] = useState(userProfile?.phone ?? '');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearError = (field: string) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const nameErr = validateDisplayName(displayName);
    const phoneErr = validatePhone(phone);
    if (nameErr) newErrors.displayName = nameErr;
    if (phoneErr) newErrors.phone = phoneErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!auth.currentUser || !userProfile) return;

    setIsLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', userProfile.uid), {
        displayName: displayName.trim(),
        phone: phone.trim() || null,
        updatedAt: Date.now(),
      });

      await refreshUserProfile();
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Edit Profile</Text>
          <Text style={styles.formSubtitle}>Update your account information below.</Text>

          <InputField
            label="Full Name"
            value={displayName}
            onChangeText={(t) => { setDisplayName(t); clearError('displayName'); }}
            error={errors.displayName}
            leftIcon="👤"
            placeholder="Your full name"
            returnKeyType="next"
          />

          <InputField
            label="Email"
            value={userProfile?.email ?? ''}
            editable={false}
            leftIcon="✉️"
            hint="Email cannot be changed"
            style={{ opacity: 0.5 }}
          />

          <InputField
            label="Phone (optional)"
            value={phone}
            onChangeText={(t) => { setPhone(t); clearError('phone'); }}
            error={errors.phone}
            leftIcon="📱"
            keyboardType="phone-pad"
            placeholder="+94 77 123 4567"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <GradientButton
            title="Save Changes"
            onPress={handleSave}
            isLoading={isLoading}
            style={styles.saveBtn}
          />

          <GradientButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.cancelBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xl, paddingTop: spacing.xxxl },
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
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  saveBtn: { marginTop: spacing.md, marginBottom: spacing.sm },
  cancelBtn: { alignSelf: 'center' },
});
