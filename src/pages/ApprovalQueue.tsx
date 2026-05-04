import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApprovals, Approval, ApprovalStage } from '../api/approvals';
import ApprovalForm from '../components/ApprovalForm';
import ConflictBadge from '../components/ConflictBadge';

const stageNames: Record<number, string> = {
  [ApprovalStage.Functional]: 'Functional',
  [ApprovalStage.Compliance]: 'Compliance',
  [ApprovalStage.Sponsor]: 'Sponsor',
  [ApprovalStage.Operational]: 'Operational',
  [ApprovalStage.Coordination]: 'Coordination',
  [ApprovalStage.Executive]: 'Executive',
};

const ApprovalQueue: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number | undefined>(undefined);
  const [selectedReviewer, setSelectedReviewer] = useState<string>('');

  const { data: approvals = [], isLoading, refetch } = useQuery({
    queryKey: ['approvals', selectedStage, selectedReviewer],
    queryFn: () => getApprovals(selectedStage, selectedReviewer || undefined),
  });

  const grouped = (approvals as Approval[]).reduce<Record<number, Approval[]>>((acc, appr) => {
    if (!acc[appr.stage]) acc[appr.stage] = [];
    acc[appr.stage].push(appr);
    return acc;
  }, {});

  const handleApprove = async (id: string, comment: string) => {
    await refetch();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Approval Queue</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="px-3 py-2 border rounded text-sm"
          value={selectedStage || ''}
          onChange={(e) => setSelectedStage(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">All Stages</option>
          {Object.entries(stageNames).map(([val, name]) => (
            <option key={val} value={val}>{name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by reviewer..."
          className="px-3 py-2 border rounded text-sm"
          value={selectedReviewer}
          onChange={(e) => setSelectedReviewer(e.target.value)}
        />
      </div>

      {/* Stage Columns */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(stageNames).map(([stage, name]) => (
          <div key={stage} className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3 flex justify-between">
              {name}
              <span className="text-gray-400">{grouped[Number(stage)]?.length || 0}</span>
            </h3>
            <div className="space-y-2">
              {(grouped[Number(stage)] || []).map((appr) => (
                <div key={appr.id} className="p-3 border rounded bg-gray-50">
                  <div className="text-sm font-medium">{appr.document_id}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{appr.reviewer}</span>
                    <ConflictBadge severity={appr.status === 'approved' ? 'low' : 'medium'} count={1} />
                  </div>
                  {appr.status === 'pending' && (
                    <ApprovalForm
                      approvalId={appr.id}
                      currentStage={appr.stage}
                      onApprove={handleApprove}
                      onReject={handleApprove}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalQueue;
