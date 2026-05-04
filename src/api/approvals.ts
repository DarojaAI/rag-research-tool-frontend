import apiClient from './client';

export enum ApprovalStage {
  Functional = 1,
  Compliance = 2,
  Sponsor = 3,
  Operational = 4,
  Coordination = 5,
  Executive = 6,
}

export enum ApprovalDecision {
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface Approval {
  id: string;
  document_id: string;
  stage: number;
  reviewer: string;
  status: string;
  decision_date?: string;
  comment?: string;
}

export const getApprovals = async (stage?: number, reviewer?: string): Promise<Approval[]> => {
  const params: Record<string, string | number> = {};
  if (stage) params['stage'] = stage;
  if (reviewer) params['reviewer'] = reviewer;
  const response = await apiClient.get<Approval[]>('/approvals', { params });
  return response.data;
};

export const approveApproval = async (id: string, comment: string = ''): Promise<any> => {
  const response = await apiClient.post(`/approvals/${id}/approve`, { comment });
  return response.data;
};

export const rejectApproval = async (id: string, comment: string = ''): Promise<any> => {
  const response = await apiClient.post(`/approvals/${id}/reject`, { comment });
  return response.data;
};

export const getApprovalHistory = async (documentId: string): Promise<Approval[]> => {
  const response = await apiClient.get<Approval[]>(`/approvals/history`, {
    params: { document_id: documentId },
  });
  return response.data;
};
