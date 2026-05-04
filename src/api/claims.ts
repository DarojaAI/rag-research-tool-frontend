import apiClient from './client';

export interface ClaimVersion {
  id: string;
  document_id: string;
  event_id: string;
  claim_text: string;
  version: number;
  status: string;
  confidence: number;
}

export interface ClaimContradiction {
  id: string;
  claim_a_id: string;
  claim_b_id: string;
  contradiction_type: string;
  severity: string;
  status: string;
  approver?: string;
}

export const getClaims = async (documentId?: string): Promise<ClaimVersion[]> => {
  const params = documentId ? { document_id: documentId } : {};
  const response = await apiClient.get<ClaimVersion[]>('/claims', { params });
  return response.data;
};

export const getContradictions = async (eventId?: string): Promise<ClaimContradiction[]> => {
  const params = eventId ? { event_id: eventId } : {};
  const response = await apiClient.get<ClaimContradiction[]>('/contradictions', { params });
  return response.data;
};

export const updateContradiction = async (id: string, status: string, approver?: string): Promise<any> => {
  const response = await apiClient.patch(`/contradictions/${id}`, { status, approver });
  return response.data;
};
