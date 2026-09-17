// src/screens/bookings/MyBookingsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookingsStackParamList, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingsContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

type Props = NativeStackScreenProps<BookingsStackParamList, 'MyBookings'>;

export default function MyBookingsScreen({ navigation }: Props) {
  const { userProfile } = useAuth();
  const { bookings, setBookings } = useBookings();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!userProfile) return;
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userProfile.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetched: Booking[] = [];
      snapshot.forEach(doc => {
        fetched.push(doc.data() as Booking);
      });
      setBookings(fetched);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userProfile, setBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const isCancelled = item.status === 'cancelled';
    const dateStr = new Date(item.eventDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <TouchableOpacity 
        style={[styles.card, isCancelled && styles.cardCancelled]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TicketDetail', { bookingId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.statusBadge, isCancelled && styles.statusCancelled]}>
            {item.status.toUpperCase()}
          </Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        <Text style={styles.eventTitle} numberOfLines={2}>{item.eventTitle}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.seatsText}>🎟️ {item.numberOfSeats} Tickets</Text>
          <Text style={styles.priceText}>
            {item.totalPrice === 0 ? 'Free' : `$${item.totalPrice}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🎫</Text>
          <Text style={styles.emptyTitle}>No tickets yet</Text>
          <Text style={styles.emptySubtitle}>When you book an event, it will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderBookingCard}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  cardCancelled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    backgroundColor: colors.success + '20',
    color: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 1,
  },
  statusCancelled: {
    backgroundColor: colors.error + '20',
    color: colors.error,
  },
  dateText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.semiBold,
  },
  eventTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  seatsText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  priceText: {
    fontSize: typography.fontSizes.md,
    color: colors.primaryLight,
    fontWeight: typography.fontWeights.bold,
  },
});
