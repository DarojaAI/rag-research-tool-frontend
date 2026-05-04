import { create } from 'zustand';
import { Approval, getApprovals, approveApproval, rejectApproval } from '../api/approvals';

interface ApprovalState {
  approvals: Approval[];
  loading: boolean;
  error: string | null;
  filterStage?: number;
  filterReviewer?: string;
  setApprovals: (approvals: Approval[]) => void;
  setFilterStage: (stage?: number) => void;
  setFilterReviewer: (reviewer?: string) => void;
  fetchApprovals: () => Promise<void>;
  approve: (id: string, comment?: string) => Promise<void>;
  reject: (id: string, comment?: string) => Promise<void>;
}

export const useApprovalStore = create<ApprovalState>((set, get) => ({
  approvals: [],
  loading: false,
  error: null,
  filterStage: undefined,
  filterReviewer: undefined,

  setApprovals: (approvals) => set({ approvals }),

  setFilterStage: (stage) => set({ filterStage: stage }),

  setFilterReviewer: (reviewer) => set({ filterReviewer: reviewer }),

  fetchApprovals: async () => {
    set({ loading: true, error: null });
    try {
      const { filterStage, filterReviewer } = get();
      const approvals = await getApprovals(filterStage, filterReviewer || undefined);
      set({ approvals, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  approve: async (id, comment) => {
    await approveApproval(id, comment || '');
    await get().fetchApprovals();
  },

  reject: async (id, comment) => {
    await rejectApproval(id, comment || '');
    await get().fetchApprovals();
  },
}));
