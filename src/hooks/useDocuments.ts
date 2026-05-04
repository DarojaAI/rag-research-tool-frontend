import { useEffect } from 'react';
import { useDocumentStore } from '../store/documentSlice';

export const useDocuments = () => {
  const { documents, loading, fetchDocuments } = useDocumentStore();
  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);
  return { documents, loading, refetch: fetchDocuments };
};
