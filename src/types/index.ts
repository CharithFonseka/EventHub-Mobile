// src/types/index.ts

export type UserRole = 'attendee' | 'organizer';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: number; // Unix timestamp
  endDate?: number;
  location: string;
  address: string;
  imageURL?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  organizerId: string;
  organizerName: string;
  tags?: string[];
  isFeatured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

export type EventCategory =
  | 'music'
  | 'sports'
  | 'tech'
  | 'arts'
  | 'food'
  | 'business'
  | 'education'
  | 'health'
  | 'social'
  | 'other';

export const EVENT_CATEGORIES: { label: string; value: EventCategory; icon: string }[] = [
  { label: 'Music', value: 'music', icon: '🎵' },
  { label: 'Sports', value: 'sports', icon: '⚽' },
  { label: 'Tech', value: 'tech', icon: '💻' },
  { label: 'Arts', value: 'arts', icon: '🎨' },
  { label: 'Food', value: 'food', icon: '🍕' },
  { label: 'Business', value: 'business', icon: '💼' },
  { label: 'Education', value: 'education', icon: '📚' },
  { label: 'Health', value: 'health', icon: '🏃' },
  { label: 'Social', value: 'social', icon: '🎉' },
  { label: 'Other', value: 'other', icon: '✨' },
];

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: number;
  eventImageURL?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  numberOfSeats: number;
  totalPrice: number;
  notes?: string;
  status: BookingStatus;
  createdAt: number;
  updatedAt: number;
}

// Navigation param lists
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Browse: undefined;
  MyBookings: undefined;
  Favourites: undefined;
  Profile: undefined;
  Organizer: undefined;
};

export type BrowseStackParamList = {
  EventList: undefined;
  EventDetail: { eventId: string };
  BookingFlow: { eventId: string };
  BookingConfirmation: { bookingId: string; eventTitle: string };
};

export type OrganizerStackParamList = {
  OrganizerDashboard: undefined;
  AddEvent: undefined;
  EditEvent: { eventId: string };
  OrganizerEventDetail: { eventId: string };
  EventBookings: { eventId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};
