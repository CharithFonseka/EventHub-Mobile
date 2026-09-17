// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography } from '../theme';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🎪</Text>
        </View>
        <Text style={styles.appName}>EventHub</Text>
        <Text style={styles.tagline}>Discover · Book · Experience</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryGlow,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: typography.fontSizes.display,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
