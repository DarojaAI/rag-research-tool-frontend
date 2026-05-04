import apiClient from './client';

export interface Event {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  sponsor_org: string;
  compliance_framework?: Record<string, any>;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await apiClient.get<Event[]>('/events');
  return response.data;
};

export const getEventStatus = async (id: string): Promise<{ event: Event; total_conflicts: number }> => {
  const response = await apiClient.get(`/events/${id}/status`);
  return response.data;
};

export const getEventConflicts = async (id: string): Promise<any[]> => {
  const response = await apiClient.get(`/events/${id}/conflicts`);
  return response.data;
};
