// src/screens/browse/EventDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BrowseStackParamList, Event } from '../../types';
import { colors, typography, spacing, borderRadius } from '../../theme';
import GradientButton from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<BrowseStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', eventId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setEvent({ id: snapshot.id, ...snapshot.data() } as Event);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
        <GradientButton 
          title="Go Back" 
          variant="outline" 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const isSoldOut = event.availableSeats <= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: event.imageURL || 'https://via.placeholder.com/600x400?text=Event' }} 
            style={styles.image} 
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category.toUpperCase()}</Text>
            </View>
            <Text style={[styles.statusText, isSoldOut && styles.soldOutText]}>
              {isSoldOut ? 'SOLD OUT' : `${event.availableSeats} seats available`}
            </Text>
          </View>

          {/* Quick Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>📅</Text>
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{dateStr}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>📍</Text>
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
                <Text style={styles.infoSubValue}>{event.address}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>👤</Text>
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Organizer</Text>
                <Text style={styles.infoValue}>{event.organizerName}</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <GradientButton 
          title={isSoldOut ? "Event Sold Out" : "Book Now"} 
          onPress={() => navigation.navigate('BookingFlow', { eventId: event.id })}
          disabled={isSoldOut}
          style={styles.bookBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
  },
  scrollContent: {
    paddingBottom: 100, // Make room for fixed bottom bar
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  priceBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  priceText: {
    color: colors.textOnPrimary,
    fontWeight: typography.fontWeights.extraBold,
    fontSize: typography.fontSizes.lg,
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  categoryBadge: {
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  statusText: {
    color: colors.success,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
  },
  soldOutText: {
    color: colors.error,
  },
  infoCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 18,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
  },
  infoSubValue: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.relaxed,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    padding: spacing.xl,
    paddingBottom: spacing.xxl, // Extra padding for devices with home indicator
  },
  bookBtn: {
    width: '100%',
  },
});
