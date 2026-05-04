import apiClient from './client';

export interface Document {
  id: string;
  original_name: string;
  stored_path?: string;
  doc_type: string;
  status: string;
  event_id?: string;
  uploaded_at?: string;
}

export interface DocumentComparison {
  document_id: string;
  version_a: number;
  version_b: number;
  diffs: {
    added: Array<{ text: string }>;
    removed: Array<{ text: string }>;
    changed: Array<{ text: string; old: string; new: string }>;
  };
}

export const getDocuments = async (eventId?: string): Promise<Document[]> => {
  const params = eventId ? { event_id: eventId } : {};
  const response = await apiClient.get<Document[]>('/documents', { params });
  return response.data;
};

export const getDocument = async (id: string): Promise<Document> => {
  const response = await apiClient.get<Document>(`/documents/${id}`);
  return response.data;
};

export const compareDocuments = async (
  docId: string, v1: number, v2: number
): Promise<DocumentComparison> => {
  const response = await apiClient.get<DocumentComparison>(
    `/documents/${docId}/compare`,
    { params: { v1, v2 } }
  );
  return response.data;
};
