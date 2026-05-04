import { useState, useEffect } from 'react';
import { getImpactAnalysis, ImpactAnalysis } from '../api/audit';

export const useImpactAnalysis = (changeId: string) => {
  const [data, setData] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!changeId) return;
    setLoading(true);
    getImpactAnalysis(changeId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [changeId]);

  return { data, loading, error };
};
