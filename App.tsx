// App.tsx — EventHub root component
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { EventsProvider } from './src/contexts/EventsContext';
import { BookingsProvider } from './src/contexts/BookingsContext';
import RootNavigator from './src/navigation/RootNavigator';
import { setupNotifications } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0D1B2A" />
      <AuthProvider>
        <EventsProvider>
          <BookingsProvider>
            <RootNavigator />
          </BookingsProvider>
        </EventsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
