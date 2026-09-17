// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import BrowseNavigator from './BrowseNavigator';
import ProfileNavigator from './ProfileNavigator';
import OrganizerNavigator from './OrganizerNavigator';
import MyBookingsScreen from '../screens/bookings/MyBookingsScreen';
import FavouritesScreen from '../screens/browse/FavouritesScreen';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({
  emoji,
  focused,
  label,
}: {
  emoji: string;
  focused: boolean;
  label: string;
}) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
      {label}
    </Text>
  </View>
);

export default function MainTabNavigator() {
  const { userProfile } = useAuth();
  const isOrganizer = userProfile?.role === 'organizer';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" focused={focused} label="Browse" />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎟️" focused={focused} label="Bookings" />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❤️" focused={focused} label="Saved" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} label="Profile" />
          ),
        }}
      />
      {isOrganizer && (
        <Tab.Screen
          name="Organizer"
          component={OrganizerNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🗂️" focused={focused} label="Manage" />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBackground,
    borderTopColor: colors.surfaceBorder,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabEmojiFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelInactive: {
    color: colors.tabInactive,
  },
});
