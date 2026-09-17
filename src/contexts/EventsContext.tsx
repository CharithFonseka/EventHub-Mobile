// src/contexts/EventsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, EventCategory } from '../types';

interface EventsContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: EventCategory | 'all';
  setSelectedCategory: (cat: EventCategory | 'all') => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  favouriteIds: string[];
  toggleFavourite: (eventId: string) => void;
  isFavourite: (eventId: string) => boolean;
}

const EventsContext = createContext<EventsContextType>({} as EventsContextType);

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  const toggleFavourite = (eventId: string) => {
    setFavouriteIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const isFavourite = (eventId: string) => favouriteIds.includes(eventId);

  return (
    <EventsContext.Provider
      value={{
        events,
        setEvents,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        viewMode,
        setViewMode,
        favouriteIds,
        toggleFavourite,
        isFavourite,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
