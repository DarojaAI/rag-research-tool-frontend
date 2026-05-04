import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditTrail, AuditEntry } from '../api/audit';
import TimelineItem from '../components/TimelineItem';

const AuditTrail: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['audit', selectedDoc, selectedEvent],
    queryFn: () => getAuditTrail(
      selectedDoc || undefined,
      selectedEvent || undefined
    ),
  });

  // Group by date
  const grouped = (entries as AuditEntry[]).reduce<Record<string, AuditEntry[]>>((acc, entry) => {
    const date = new Date(entry.changed_at).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Audit Trail</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by document ID..."
          className="px-3 py-2 border rounded text-sm flex-1"
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 border rounded text-sm"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm"
          onClick={() => refetch()}
        >
          Refresh
        </button>
        <button
          className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
          onClick={() => { setSelectedDoc(''); setSelectedEvent(''); }}
        >
          Clear
        </button>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl">
        {isLoading && <p className="text-gray-500">Loading audit trail...</p>}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
            <div className="space-y-4">
              {items.map((entry, idx) => (
                <TimelineItem
                  key={entry.id}
                  title={entry.claim_text}
                  description={`Claim: ${entry.claim_text}`}
                  timestamp={entry.changed_at}
                  actor={entry.changed_by}
                  isLast={idx === items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
        {!isLoading && entries.length === 0 && (
          <p className="text-gray-500">No audit entries found.</p>
        )}
      </div>

      {/* Export Buttons */}
      <div className="mt-6 flex gap-2">
        <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm">
          Export as CSV
        </button>
        <button className="ml-2 px-4 py-2 border rounded hover:bg-gray-50 text-sm">
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default AuditTrail;
