// src/screens/organizer/OrganizerDashboardScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { OrganizerStackParamList, Event } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/events/EventCard';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { seedEvents } from '../../utils/seed';
import GradientButton from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<OrganizerStackParamList, 'Dashboard'>;

export default function OrganizerDashboardScreen({ navigation }: Props) {
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchMyEvents = useCallback(async () => {
    if (!userProfile) return;
    try {
      const q = query(
        collection(db, 'events'),
        where('organizerId', '==', userProfile.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetched: Event[] = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(fetched);
    } catch (error) {
      console.error('Error fetching organizer events:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userProfile]);

  useEffect(() => {
    // Focus listener to refresh events when returning from Create Event
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyEvents();
    });
    return unsubscribe;
  }, [navigation, fetchMyEvents]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMyEvents();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedEvents();
    setIsSeeding(false);
    if (result.success) {
      Alert.alert('Success', result.message);
      // We don't fetchMyEvents here because seed events are assigned to 'seed-organizer', 
      // not the current user. They will show up in the Browse tab.
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Events</Text>
      <Text style={styles.headerSubtitle}>Manage the events you've created</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.devCard}>
        <Text style={styles.devTitle}>Development Tools</Text>
        <Text style={styles.devText}>
          Use this to populate the "Browse" tab with dummy events.
        </Text>
        <GradientButton 
          title="Seed Sample Events" 
          onPress={handleSeed}
          isLoading={isSeeding}
          size="sm"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎪</Text>
              <Text style={styles.emptyTitle}>No events yet</Text>
              <Text style={styles.emptySubtitle}>You haven't created any events. Tap the + button to create your first event!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              viewMode="list"
              onPress={() => {
                // Future stage: navigate to manage event / attendee list
                Alert.alert('Event Management', 'Managing specific events will come in a future stage.');
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100, // Make room for FAB
  },
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
  headerSubtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
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
    lineHeight: typography.lineHeights.relaxed,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
  footerContainer: {
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  devCard: {
    backgroundColor: colors.backgroundCard,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
  },
  devTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  devText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  }
});
