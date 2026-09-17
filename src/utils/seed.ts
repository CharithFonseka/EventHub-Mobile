// src/utils/seed.ts
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, EventCategory } from '../types';

const SAMPLE_EVENTS: Partial<Event>[] = [
  {
    title: 'Summer Music Festival 2026',
    description: 'A 3-day outdoor music festival featuring top artists from around the world. Enjoy food, music, and great vibes.',
    category: 'music',
    date: Date.now() + 86400000 * 14, // 14 days from now
    location: 'Central Park',
    address: 'Central Park, New York, NY 10024',
    imageURL: 'https://images.unsplash.com/photo-1540039155732-68473678c48a?w=800&q=80',
    price: 150,
    totalSeats: 5000,
    availableSeats: 250,
    organizerId: 'seed-organizer',
    organizerName: 'EventHub Live',
    tags: ['music', 'festival', 'outdoor'],
    status: 'upcoming',
    isFeatured: true,
  },
  {
    title: 'Global Tech Conference',
    description: 'The premier conference for developers, designers, and tech enthusiasts. Learn about AI, web3, and the future of software.',
    category: 'tech',
    date: Date.now() + 86400000 * 30, // 30 days from now
    location: 'Moscone Center',
    address: '747 Howard St, San Francisco, CA 94103',
    imageURL: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    price: 300,
    totalSeats: 1000,
    availableSeats: 450,
    organizerId: 'seed-organizer',
    organizerName: 'Tech Innovators',
    tags: ['tech', 'networking', 'startup'],
    status: 'upcoming',
    isFeatured: true,
  },
  {
    title: 'Artisan Food Market',
    description: 'Taste the best local delicacies from over 50 different food stalls. Entrance is free, just pay for what you eat!',
    category: 'food',
    date: Date.now() + 86400000 * 5, // 5 days from now
    location: 'Downtown Square',
    address: '100 Main St, Seattle, WA 98104',
    imageURL: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    price: 0,
    totalSeats: 2000,
    availableSeats: 2000,
    organizerId: 'seed-organizer',
    organizerName: 'City Events',
    tags: ['food', 'family', 'weekend'],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    title: 'Marathon 2026',
    description: 'Annual city marathon. Join thousands of runners for a beautiful 42km scenic route.',
    category: 'sports',
    date: Date.now() + 86400000 * 60, // 60 days from now
    location: 'City Stadium',
    address: '200 Stadium Dr, Austin, TX 78712',
    imageURL: 'https://images.unsplash.com/photo-1552674605-15c2145efa38?w=800&q=80',
    price: 50,
    totalSeats: 3000,
    availableSeats: 1200,
    organizerId: 'seed-organizer',
    organizerName: 'Athletics Club',
    tags: ['sports', 'health', 'running'],
    status: 'upcoming',
    isFeatured: false,
  }
];

/**
 * Utility function to populate Firestore with sample events.
 * Useful for development and testing.
 */
export const seedEvents = async () => {
  try {
    const batch = writeBatch(db);
    const eventsRef = collection(db, 'events');
    
    SAMPLE_EVENTS.forEach((eventData) => {
      const newDocRef = doc(eventsRef);
      batch.set(newDocRef, {
        ...eventData,
        id: newDocRef.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await batch.commit();
    return { success: true, message: 'Sample events added successfully!' };
  } catch (error) {
    console.error('Error seeding events:', error);
    return { success: false, message: 'Failed to seed events.' };
  }
};
