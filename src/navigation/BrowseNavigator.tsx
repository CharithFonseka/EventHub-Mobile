// src/navigation/BrowseNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrowseStackParamList } from '../types';
import EventListScreen from '../screens/browse/EventListScreen';
import EventDetailScreen from '../screens/browse/EventDetailScreen';
import BookingFlowScreen from '../screens/bookings/BookingFlowScreen';
import BookingConfirmationScreen from '../screens/bookings/BookingConfirmationScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export default function BrowseNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="EventList" component={EventListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event Details', headerBackTitle: '' }} />
      <Stack.Screen name="BookingFlow" component={BookingFlowScreen} options={{ title: 'Book Event', headerBackTitle: '' }} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
