import { create } from 'zustand';
import { Event, getEvents } from '../api/events';

interface EventState {
  events: Event[];
  selectedEventId: string;
  loading: boolean;
  setEvents: (events: Event[]) => void;
  setSelectedEventId: (id: string) => void;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEventId: '',
  loading: false,

  setEvents: (events) => set({ events }),

  setSelectedEventId: (id) => set({ selectedEventId: id }),

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const events = await getEvents();
      set({ events, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
