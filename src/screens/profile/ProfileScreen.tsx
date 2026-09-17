// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ProfileStackParamList } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import GradientButton from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string | null }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }: Props) {
  const { userProfile, firebaseUser } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch {
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  const roleBadge = userProfile?.role === 'organizer'
    ? { emoji: '🗂️', label: 'Organizer', color: colors.primary }
    : { emoji: '🎟️', label: 'Attendee', color: colors.success };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          {userProfile?.photoURL ? (
            <Image source={{ uri: userProfile.photoURL }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitial}>
              {userProfile?.displayName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          )}
        </View>
        <Text style={styles.displayName}>{userProfile?.displayName ?? 'User'}</Text>
        <View style={[styles.roleBadge, { borderColor: roleBadge.color }]}>
          <Text style={styles.roleBadgeEmoji}>{roleBadge.emoji}</Text>
          <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>{roleBadge.label}</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <InfoRow icon="✉️" label="Email" value={userProfile?.email} />
        <View style={styles.divider} />
        <InfoRow icon="📱" label="Phone" value={userProfile?.phone} />
        <View style={styles.divider} />
        <InfoRow
          icon="📅"
          label="Member Since"
          value={
            userProfile?.createdAt
              ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : undefined
          }
        />
      </View>

      {/* Edit button */}
      <GradientButton
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.editBtn}
      />

      {/* Logout */}
      <GradientButton
        title="Log Out"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.huge },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryGlow,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.glow,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitial: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  displayName: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing.xs,
  },
  roleBadgeEmoji: { fontSize: 14 },
  roleBadgeText: { fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  editBtn: { marginBottom: spacing.md },
  logoutBtn: {},
});
