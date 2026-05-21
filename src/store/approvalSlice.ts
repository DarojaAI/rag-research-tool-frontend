import { create } from 'zustand';

interface ApprovalState {
  filterStage?: number;
  filterReviewer?: string;
  setFilterStage: (stage?: number) => void;
  setFilterReviewer: (reviewer?: string) => void;
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  filterStage: undefined,
  filterReviewer: undefined,

  setFilterStage: (stage) => set({ filterStage: stage }),

  setFilterReviewer: (reviewer) => set({ filterReviewer: reviewer }),
}));
