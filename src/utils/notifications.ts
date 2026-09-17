// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests permission for local notifications (iOS/Android).
 */
export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7B2FBE', // Using primary brand color
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

/**
 * Triggers a local notification when a booking is confirmed.
 */
export async function notifyBookingConfirmed(eventTitle: string, bookingId: string) {
  const hasPermission = await setupNotifications();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎟️ Booking Confirmed!",
      body: `Your tickets for ${eventTitle} are secured. Ref: ${bookingId.substring(0, 8).toUpperCase()}`,
      sound: true,
    },
    trigger: null, // null means trigger immediately
  });
}

/**
 * Triggers a local notification when an organizer successfully creates an event.
 */
export async function notifyEventCreated(eventTitle: string) {
  const hasPermission = await setupNotifications();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✅ Event Created Successfully!",
      body: `"${eventTitle}" is now live and ready for attendees to book.`,
      sound: true,
    },
    trigger: null,
  });
}
