import { create } from 'zustand';
import { Document, getDocuments } from '../api/documents';

interface DocumentState {
  documents: Document[];
  loading: boolean;
  filterEventType: string;
  setDocuments: (docs: Document[]) => void;
  setFilterEventType: (eventId: string) => void;
  fetchDocuments: () => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: false,
  filterEventType: '',

  setDocuments: (documents) => set({ documents }),

  setFilterEventType: (eventId) => set({ filterEventType: eventId }),

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const { filterEventType } = get();
      const documents = await getDocuments(filterEventType || undefined);
      set({ documents, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
