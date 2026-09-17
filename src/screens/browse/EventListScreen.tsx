// src/screens/browse/EventListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BrowseStackParamList, Event, EVENT_CATEGORIES, EventCategory } from '../../types';
import { useEvents } from '../../contexts/EventsContext';
import EventCard from '../../components/events/EventCard';
import { colors, typography, spacing, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<BrowseStackParamList, 'EventList'>;

export default function EventListScreen({ navigation }: Props) {
  const { 
    events, setEvents, 
    searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory,
    viewMode, setViewMode,
    isFavourite, toggleFavourite
  } = useEvents();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const fetchedEvents: Event[] = [];
      snapshot.forEach(doc => {
        fetchedEvents.push(doc.data() as Event);
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [setEvents]);

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    } else {
      setIsLoading(false);
    }
  }, [events.length, fetchEvents]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEvents();
  };

  // Filter events based on search and category
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover Events</Text>
          <TouchableOpacity 
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            style={styles.viewModeBtn}
          >
            <Text style={styles.viewModeIcon}>{viewMode === 'list' ? '🔲' : '📋'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✖️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            <TouchableOpacity
              style={[styles.categoryPill, selectedCategory === 'all' && styles.categoryPillActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            
            {EVENT_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.categoryPill, selectedCategory === cat.value && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat.value)}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                <Text style={[styles.categoryText, selectedCategory === cat.value && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Event List / Grid */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyIcon}>🏜️</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            key={viewMode === 'grid' ? 'grid' : 'list'} // Force re-render on view mode change
            numColumns={viewMode === 'grid' ? 2 : 1}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            renderItem={({ item }) => (
              <EventCard 
                event={item} 
                viewMode={viewMode}
                isFavourite={isFavourite(item.id)}
                onToggleFavourite={() => toggleFavourite(item.id)}
                onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
  },
  viewModeBtn: {
    padding: spacing.xs,
  },
  viewModeIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    height: 50,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSizes.md,
  },
  clearIcon: {
    fontSize: 14,
    marginLeft: spacing.sm,
    opacity: 0.7,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  categoryPillActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
  },
  categoryTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
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
  },
});
