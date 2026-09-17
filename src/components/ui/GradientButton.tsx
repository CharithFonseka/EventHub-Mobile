// src/components/ui/GradientButton.tsx
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  variant = 'primary',
  size = 'lg',
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
  }[size];

  const textSize = { sm: typography.fontSizes.sm, md: typography.fontSizes.md, lg: typography.fontSizes.lg }[size];

  if (variant === 'outline') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || isLoading}
          style={[styles.outlineBtn, sizeStyles, (disabled || isLoading) && styles.disabled]}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={[styles.outlineBtnText, { fontSize: textSize }]}>{title}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'ghost') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || isLoading}
          style={[sizeStyles]}
          activeOpacity={0.7}
        >
          <Text style={[styles.ghostBtnText, { fontSize: textSize }]}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={1}
        style={styles.touchable}
      >
        <LinearGradient
          colors={disabled || isLoading ? ['#444', '#333'] : colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyles]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.btnText, { fontSize: textSize }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    minHeight: 52,
  },
  btnText: {
    color: colors.textOnPrimary,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  outlineBtnText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
  ghostBtnText: {
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  disabled: {
    opacity: 0.5,
  },
});
