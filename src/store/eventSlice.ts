import { create } from 'zustand';

interface EventState {
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  selectedEventId: '',

  setSelectedEventId: (id) => set({ selectedEventId: id }),
}));
