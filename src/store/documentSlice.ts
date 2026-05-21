import { create } from 'zustand';

interface DocumentState {
  filterEventType: string;
  setFilterEventType: (eventId: string) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  filterEventType: '',

  setFilterEventType: (eventId) => set({ filterEventType: eventId }),
}));
