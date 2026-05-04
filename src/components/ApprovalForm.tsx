import React, { useState } from 'react';
import { ApprovalStage, ApprovalDecision } from '../api/approvals';

interface ApprovalFormProps {
  approvalId: string;
  currentStage: ApprovalStage;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}

const ApprovalForm: React.FC<ApprovalFormProps> = ({ approvalId, currentStage, onApprove, onReject }) => {
  const [comment, setComment] = useState('');

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-sm font-medium mb-3">Stage {currentStage}: Decision</h3>
      <textarea
        className="w-full p-2 border rounded text-sm"
        rows={3}
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          onClick={() => onApprove(approvalId, comment)}
        >
          Approve
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          onClick={() => onReject(approvalId, comment)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ApprovalForm;
