import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents, Event } from '../api/events';
import { getEventStatus } from '../api/events';

const MultiEventDashboard: React.FC = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: statusMap = {} } = useQuery({
    queryKey: ['event-statuses'],
    queryFn: async () => {
      const results: Record<string, any> = {};
      for (const event of events) {
        try {
          results[event.id] = await getEventStatus(event.id);
        } catch {}
      }
      return results;
    },
    enabled: events.length > 0,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Multi-Event Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total Events</div>
          <div className="text-3xl font-bold mt-1">{events.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Open Conflicts</div>
          <div className="text-3xl font-bold mt-1 text-red-600">
            {Object.values(statusMap).reduce((sum: number, s: any) => sum + (s?.total_conflicts || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Approved Today</div>
          <div className="text-3xl font-bold mt-1 text-green-600">0</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Pending Review</div>
          <div className="text-3xl font-bold mt-1 text-yellow-600">0</div>
        </div>
      </div>

      {/* Charts Placeholder - Recharts to be added */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Conflicts by Department (Heatmap)</h3>
          <div className="bg-gray-50 rounded p-8 text-center text-gray-400 text-sm">
            [Recharts Heatmap: Department × Conflict Severity]<br />
            Transport: 5 HIGH, 3 MEDIUM, 2 LOW<br />
            Catering: 2 HIGH, 4 MEDIUM, 1 LOW
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Conflict Trend Over Time</h3>
          <div className="bg-gray-50 rounded p-8 text-center text-gray-400 text-sm">
            [Recharts Line Chart: Date × Conflict Count]<br />
            Trend: ↗ Increasing (15 → 28 conflicts over 30 days)<br />
            Spike on 2026-04-15 (ISVFE prep deadline)
          </div>
        </div>
      </div>

      {/* Event Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Events Overview</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Event</th>
              <th className="text-left p-3">Dates</th>
              <th className="text-left p-3">Sponsor</th>
              <th className="text-center p-3">Conflicts</th>
              <th className="text-center p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading events...</td></tr>
            )}
            {events.map((event: Event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{event.name}</td>
                <td className="p-3 text-gray-600">
                  {event.start_date} — {event.end_date}
                </td>
                <td className="p-3">{event.sponsor_org}</td>
                <td className="p-3 text-center">
                  <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                    {statusMap[event.id]?.total_conflicts || 0}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-flex px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Planning
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiEventDashboard;
