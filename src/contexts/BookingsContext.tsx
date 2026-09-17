// src/contexts/BookingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '../types';

interface BookingsContextType {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
}

const BookingsContext = createContext<BookingsContextType>({} as BookingsContextType);

export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  return (
    <BookingsContext.Provider value={{ bookings, setBookings, addBooking, updateBooking }}>
      {children}
    </BookingsContext.Provider>
  );
};
