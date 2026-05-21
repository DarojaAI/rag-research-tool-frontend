import { useQuery } from '@tanstack/react-query';
import { getImpactAnalysis } from '../api/audit';

export const useImpactAnalysis = (changeId: string) => {
  return useQuery({
    queryKey: ['impact-analysis', changeId],
    queryFn: () => getImpactAnalysis(changeId),
    enabled: !!changeId,
  });
};
