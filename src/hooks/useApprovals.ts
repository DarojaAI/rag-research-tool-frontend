import { useEffect } from 'react';
import { useApprovalStore } from '../store/approvalSlice';

export const useApprovals = () => {
  const { approvals, loading, error, fetchApprovals } = useApprovalStore();
  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);
  return { approvals, loading, error, refetch: fetchApprovals };
};
