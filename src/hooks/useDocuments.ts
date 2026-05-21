import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../api/documents';
import { useDocumentStore } from '../store/documentSlice';

export const useDocuments = () => {
  const { filterEventType } = useDocumentStore();

  return useQuery({
    queryKey: ['documents', filterEventType],
    queryFn: () => getDocuments(filterEventType || undefined),
  });
};
