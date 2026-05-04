import apiClient from './client';

export interface AuditEntry {
  id: string;
  document_id: string;
  claim_text: string;
  status: string;
  changed_by: string;
  changed_at: string;
}

export interface ImpactAnalysis {
  change_id: string;
  affected_departments: Array<{
    name: string;
    path: string[];
    depth: number;
    severity: string;
  }>;
  recommended_actions: string[];
}

export const getAuditTrail = async (documentId?: string, eventId?: string): Promise<AuditEntry[]> => {
  const params: Record<string, string> = {};
  if (documentId) params['document_id'] = documentId;
  if (eventId) params['event_id'] = eventId;
  const response = await apiClient.get<AuditEntry[]>('/audit/trail', { params });
  return response.data;
};

export const getImpactAnalysis = async (changeId: string): Promise<ImpactAnalysis> => {
  const response = await apiClient.get<ImpactAnalysis>('/audit/impact', {
    params: { change_id: changeId },
  });
  return response.data;
};
