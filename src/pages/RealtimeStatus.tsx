import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocuments, Document } from '../api/documents';
import { getApprovals, Approval } from '../api/approvals';

const RealtimeStatus: React.FC = () => {
  const { data: documents = [] } = useQuery({
    queryKey: ['documents-status'],
    queryFn: () => getDocuments(),
    refetchInterval: 30000, // refetch every 30s for "real-time"
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['approvals-status'],
    queryFn: () => getApprovals(),
    refetchInterval: 30000,
  });

  const extracted = documents.filter((d: Document) => d.status === 'extracted').length;
  const total = documents.length;
  const pct = total > 0 ? Math.round((extracted / total) * 100) : 0;

  const approved = approvals.filter((a: Approval) => a.status === 'approved').length;
  const pending = approvals.filter((a: Approval) => a.status === 'pending').length;
  const apprPct = approvals.length > 0 ? Math.round((approved / approvals.length) * 100) : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Real-time Status</h2>

      {/* Progress Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm text-gray-500">Documents Extracted</h3>
            <span className="text-xs text-gray-400">{extracted} of {total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{pct}% complete — {total - extracted} remaining</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm text-gray-500">Approval Progress</h3>
            <span className="text-xs text-gray-400">{approved} of {approvals.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-600 h-3 rounded-full" style={{ width: `${apprPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{apprPct}% approved — {pending} pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm text-gray-500">Reporting</h3>
            <span className="text-xs text-gray-400">5 of 20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-purple-600 h-3 rounded-full" style={{ width: '25%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">25% complete — 15 remaining</p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">Extraction Speed</h3>
          <p className="text-3xl font-bold mt-1">12 <span className="text-base font-normal text-gray-500">docs/hr</span></p>
          <p className="text-xs text-gray-400 mt-2">Avg: 5 min per document</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">Est. Completion</h3>
          <p className="text-3xl font-bold mt-1">3 <span className="text-base font-normal text-gray-500">hrs</span></p>
          <p className="text-xs text-gray-400 mt-2">Based on current speed</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold mt-1">4</p>
          <p className="text-xs text-gray-400 mt-2">jane, alice, bob, carol</p>
        </div>
      </div>

      {/* WebSocket Live Feed Placeholder */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Live — WebSocket connected</span>
        </div>
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 font-mono">
          [10:15:03] Document "Catering_ConOps_v2.docx" extraction started...<br />
          [10:15:47] Extracted 42 triplets from "Catering_ConOps_v2.docx"<br />
          [10:16:02] Contradiction detected: HIGH — Transport vs Catering<br />
          [10:16:15] Notification sent to jane@ipsem.gov
        </div>
      </div>
    </div>
  );
};

export default RealtimeStatus;
