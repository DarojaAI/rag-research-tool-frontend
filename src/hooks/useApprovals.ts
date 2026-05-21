import { useQuery } from '@tanstack/react-query';
import { getApprovals } from '../api/approvals';
import { useApprovalStore } from '../store/approvalSlice';

export const useApprovals = () => {
  const { filterStage, filterReviewer } = useApprovalStore();

  return useQuery({
    queryKey: ['approvals', filterStage, filterReviewer],
    queryFn: () => getApprovals(filterStage, filterReviewer || undefined),
  });
};
