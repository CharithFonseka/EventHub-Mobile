// src/screens/bookings/BookingFlowScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc, runTransaction, collection, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BrowseStackParamList, Event, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import InputField from '../../components/ui/InputField';
import GradientButton from '../../components/ui/GradientButton';
import { validatePhone } from '../../utils/validation';

type Props = NativeStackScreenProps<BrowseStackParamList, 'BookingFlow'>;

export default function BookingFlowScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { userProfile } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  
  const [numberOfSeats, setNumberOfSeats] = useState('1');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [notes, setNotes] = useState('');
  
  const [isBooking, setIsBooking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', eventId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setEvent({ id: snapshot.id, ...snapshot.data() } as Event);
        }
      } catch (error) {
        console.error('Error fetching event for booking:', error);
      } finally {
        setIsLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const seats = parseInt(numberOfSeats, 10);
    
    if (isNaN(seats) || seats < 1) {
      newErrors.numberOfSeats = 'Please enter a valid number of seats.';
    } else if (event && seats > event.availableSeats) {
      newErrors.numberOfSeats = `Only ${event.availableSeats} seats available.`;
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!validate() || !event || !userProfile) return;
    setIsBooking(true);

    try {
      const seatsToBook = parseInt(numberOfSeats, 10);
      const eventRef = doc(db, 'events', eventId);
      const bookingRef = firestoreDoc(collection(db, 'bookings'));

      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error('Event does not exist!');
        }

        const currentAvailable = eventDoc.data().availableSeats;
        if (currentAvailable < seatsToBook) {
          throw new Error(`Sorry, only ${currentAvailable} seats are left.`);
        }

        // 1. Decrement available seats
        transaction.update(eventRef, {
          availableSeats: currentAvailable - seatsToBook
        });

        // 2. Create the booking document
        const newBooking: Booking = {
          id: bookingRef.id,
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventImageURL: event.imageURL,
          userId: userProfile.uid,
          userName: userProfile.displayName,
          userEmail: userProfile.email,
          userPhone: phone.trim(),
          numberOfSeats: seatsToBook,
          totalPrice: event.price * seatsToBook,
          notes: notes.trim(),
          status: 'confirmed',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        transaction.set(bookingRef, newBooking);
      });

      // Transaction successful, go to confirmation
      navigation.replace('BookingConfirmation', { bookingId: bookingRef.id });

    } catch (error: any) {
      Alert.alert('Booking Failed', error.message || 'An error occurred during booking.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  const seatsNum = parseInt(numberOfSeats, 10) || 0;
  const totalPrice = seatsNum * event.price;

  return (
    <KeyboardAvoidingView 
      style={styles.flex} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per seat</Text>
            <Text style={styles.summaryValue}>
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Available seats</Text>
            <Text style={styles.summaryValue}>{event.availableSeats}</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>
              {totalPrice === 0 ? 'Free' : `$${totalPrice}`}
            </Text>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Your Details</Text>
          
          <InputField
            label="Full Name"
            value={userProfile?.displayName || ''}
            editable={false}
            style={{ opacity: 0.6 }}
            leftIcon="👤"
          />

          <InputField
            label="Email"
            value={userProfile?.email || ''}
            editable={false}
            style={{ opacity: 0.6 }}
            leftIcon="✉️"
          />

          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={(t) => { setPhone(t); setErrors(e => ({ ...e, phone: '' })); }}
            error={errors.phone}
            placeholder="+1 234 567 890"
            keyboardType="phone-pad"
            leftIcon="📱"
          />

          <InputField
            label="Number of Seats"
            value={numberOfSeats}
            onChangeText={(t) => { setNumberOfSeats(t); setErrors(e => ({ ...e, numberOfSeats: '' })); }}
            error={errors.numberOfSeats}
            keyboardType="number-pad"
            leftIcon="🎟️"
          />

          <InputField
            label="Special Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or requirements?"
            leftIcon="📝"
            multiline
            style={{ height: 80, paddingVertical: spacing.md }}
          />

        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <GradientButton 
          title={`Confirm Booking • ${totalPrice === 0 ? 'Free' : `$${totalPrice}`}`}
          onPress={handleBook}
          isLoading={isBooking}
          disabled={event.availableSeats === 0}
          style={styles.confirmBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.error, fontSize: typography.fontSizes.md },
  container: {
    padding: spacing.xl,
    paddingBottom: 120, // Space for bottom bar
  },
  summaryCard: {
    backgroundColor: colors.primaryGlow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.xl,
    ...shadows.glow,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  eventTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primaryLight,
  },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  formTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.xl,
  },
  confirmBtn: {
    width: '100%',
  },
});
