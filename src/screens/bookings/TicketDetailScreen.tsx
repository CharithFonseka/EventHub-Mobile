// src/screens/bookings/TicketDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookingsStackParamList, Booking } from '../../types';
import { useBookings } from '../../contexts/BookingsContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import GradientButton from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<BookingsStackParamList, 'TicketDetail'>;

export default function TicketDetailScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const { updateBooking } = useBookings();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setBooking({ id: snapshot.id, ...snapshot.data() } as Booking);
        }
      } catch (error) {
        console.error('Error fetching ticket detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Ticket', style: 'cancel' },
        { 
          text: 'Cancel Booking', 
          style: 'destructive',
          onPress: async () => {
            if (!booking) return;
            setIsCancelling(true);
            try {
              const eventRef = doc(db, 'events', booking.eventId);
              const bookingRef = doc(db, 'bookings', booking.id);

              await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                // We proceed even if event is deleted, just update booking
                if (eventDoc.exists()) {
                  const currentAvailable = eventDoc.data().availableSeats;
                  transaction.update(eventRef, {
                    availableSeats: currentAvailable + booking.numberOfSeats
                  });
                }
                
                transaction.update(bookingRef, {
                  status: 'cancelled',
                  updatedAt: Date.now()
                });
              });

              // Update local state and context
              setBooking({ ...booking, status: 'cancelled' });
              updateBooking(booking.id, { status: 'cancelled' });
              Toast.show({
                type: 'success',
                text1: 'Cancelled',
                text2: 'Your booking has been cancelled successfully.',
                position: 'bottom',
              });

            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to cancel booking. Please try again.',
                position: 'bottom',
              });
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ticket not found.</Text>
      </View>
    );
  }

  const isCancelled = booking.status === 'cancelled';
  const dateStr = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.ticketCard}>
        
        {/* Ticket Header */}
        <View style={styles.ticketHeader}>
          <Text style={styles.eventTitle}>{booking.eventTitle}</Text>
          <Text style={styles.eventDate}>{dateStr}</Text>
        </View>

        {/* Dashed Line */}
        <View style={styles.dashedDivider}>
          <View style={styles.circleLeft} />
          <View style={styles.circleRight} />
        </View>

        {/* QR Code Placeholder */}
        <View style={styles.qrContainer}>
          <View style={[styles.qrPlaceholder, isCancelled && styles.qrCancelled]}>
            {isCancelled ? (
              <Text style={styles.qrIcon}>🚫</Text>
            ) : (
              <Text style={styles.qrIcon}>📱</Text>
            )}
            <Text style={styles.qrText}>
              {isCancelled ? 'TICKET CANCELLED' : 'SCAN AT ENTRY'}
            </Text>
          </View>
        </View>

        {/* Ticket Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{booking.userName}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Tickets</Text>
              <Text style={styles.detailValue}>{booking.numberOfSeats}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Booking Ref</Text>
              <Text style={styles.detailValue}>{booking.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[
                styles.detailValue, 
                isCancelled ? { color: colors.error } : { color: colors.success }
              ]}>
                {booking.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

      </View>

      {/* Actions */}
      {!isCancelled && (
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={handleCancelBooking}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Text style={styles.cancelBtnText}>Cancel Booking</Text>
          )}
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: colors.error, fontSize: typography.fontSizes.md },
  
  ticketCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.glow,
  },
  ticketHeader: {
    backgroundColor: colors.primary,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.extraBold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: typography.fontWeights.medium,
  },
  dashedDivider: {
    height: 1,
    width: '100%',
    borderBottomWidth: 2,
    borderColor: colors.background,
    borderStyle: 'dashed',
    position: 'relative',
    backgroundColor: '#fff',
  },
  circleLeft: {
    position: 'absolute',
    left: -15,
    top: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
  },
  circleRight: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
  },
  qrContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCancelled: {
    backgroundColor: '#fee',
    borderColor: colors.error,
  },
  qrIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  qrText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: '#888',
    letterSpacing: 1,
  },
  detailsContainer: {
    padding: spacing.xl,
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.fontSizes.xs,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: '#222',
  },
  cancelBtn: {
    marginTop: spacing.xxxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    width: '100%',
  },
  cancelBtnText: {
    color: colors.error,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
});
