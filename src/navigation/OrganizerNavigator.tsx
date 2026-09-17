// src/navigation/OrganizerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrganizerStackParamList } from '../types';
import OrganizerDashboardScreen from '../screens/organizer/OrganizerDashboardScreen';
import AddEventScreen from '../screens/organizer/AddEventScreen';
import EditEventScreen from '../screens/organizer/EditEventScreen';
import OrganizerEventDetailScreen from '../screens/organizer/OrganizerEventDetailScreen';
import EventBookingsScreen from '../screens/organizer/EventBookingsScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<OrganizerStackParamList>();

export default function OrganizerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundCard },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="OrganizerDashboard"
        component={OrganizerDashboardScreen}
        options={{ title: 'My Events' }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: 'Add Event', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: 'Edit Event', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="OrganizerEventDetail"
        component={OrganizerEventDetailScreen}
        options={{ title: 'Event Details', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="EventBookings"
        component={EventBookingsScreen}
        options={{ title: 'Event Bookings', headerBackTitle: '' }}
      />
    </Stack.Navigator>
  );
}
