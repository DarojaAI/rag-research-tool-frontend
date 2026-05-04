import React from 'react';
import { Document } from '../api/documents';
import ConflictBadge from './ConflictBadge';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  const statusColors: Record<string, string> = {
    uploaded: 'bg-blue-50 border-blue-200',
    extracting: 'bg-yellow-50 border-yellow-200',
    extracted: 'bg-green-50 border-green-200',
    failed: 'bg-red-50 border-red-200',
  };
  const bgClass = statusColors[document.status] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`p-4 border rounded-lg ${bgClass} cursor-pointer hover:shadow-md transition-shadow`} onClick={onClick}>
      <h3 className="font-medium text-sm">{document.original_name}</h3>
      <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
        <span>Type: {document.doc_type}</span>
        <span>Status: {document.status}</span>
      </div>
      {document.event_id && (
        <div className="text-xs text-gray-500 mt-1">Event: {document.event_id}</div>
      )}
    </div>
  );
};

export default DocumentCard;
