import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDocuments, Document } from '../api/documents';
import { compareDocuments } from '../api/documents';
import TripletDiffViewer from '../components/TripletDiffViewer';

const DocumentComparison: React.FC = () => {
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');
  const [versionA, setVersionA] = useState<number>(1);
  const [versionB, setVersionB] = useState<number>(2);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents-compare'],
    queryFn: () => getDocuments(),
  });

  const { data: comparison, isLoading } = useQuery({
    queryKey: ['compare', selectedA, selectedB, versionA, versionB],
    queryFn: () => compareDocuments(selectedA, versionA, versionB),
    enabled: !!(selectedA && selectedB),
  });

  // Summary counts
  const added = comparison?.diffs?.added?.length || 0;
  const removed = comparison?.diffs?.removed?.length || 0;
  const changed = comparison?.diffs?.changed?.length || 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Document Comparison</h2>
      <p className="text-sm text-gray-500 mb-6">Side-by-side triplet diffs with breaking changes highlighted.</p>

      {/* Document Selector */}
      <div className="flex gap-4 mb-6 items-center">
        <select
          className="px-3 py-2 border rounded text-sm bg-white flex-1"
          value={selectedA}
          onChange={(e) => setSelectedA(e.target.value)}
        >
          <option value="">Select document A...</option>
          {documents.map((d: Document) => (
            <option key={d.id} value={d.id}>{d.original_name} (v{versionA})</option>
          ))}
        </select>
        <span className="text-gray-400">vs</span>
        <select
          className="px-3 py-2 border rounded text-sm bg-white flex-1"
          value={selectedB}
          onChange={(e) => setSelectedB(e.target.value)}
        >
          <option value="">Select document B...</option>
          {documents.map((d: Document) => (
            <option key={d.id} value={d.id}>{d.original_name} (v{versionB})</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">vA:</label>
          <input
            type="number" min={1} max={10}
            className="w-16 px-2 py-1 border rounded text-sm"
            value={versionA}
            onChange={(e) => setVersionA(Number(e.target.value))}
          />
          <label className="text-xs text-gray-500">vB:</label>
          <input
            type="number" min={1} max={10}
            className="w-16 px-2 py-1 border rounded text-sm"
            value={versionB}
            onChange={(e) => setVersionB(Number(e.target.value))}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          onClick={() => { /* triggers refetch via queryKey change */ }}
        >
          Compare
        </button>
      </div>

      {/* Summary */}
      {comparison && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
            <p className="text-sm text-green-800 font-medium">Added</p>
            <p className="text-2xl font-bold text-green-800">{added}</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            <p className="text-sm text-red-800 font-medium">Removed</p>
            <p className="text-2xl font-bold text-red-800">{removed}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center">
            <p className="text-sm text-yellow-800 font-medium">Changed</p>
            <p className="text-2xl font-bold text-yellow-800">{changed}</p>
          </div>
        </div>
      )}

      {/* Side-by-Side Diff */}
      {isLoading && <p className="text-gray-500">Loading comparison...</p>}
      {comparison && comparison.diffs && (
        <TripletDiffViewer diffs={[
          ...comparison.diffs.added.map(d => ({ ...d, type: 'added' as const })),
          ...comparison.diffs.removed.map(d => ({ ...d, type: 'removed' as const })),
          ...comparison.diffs.changed.map(d => ({ ...d, type: 'changed' as const })),
        ]} />
      )}

      {/* Impact Assessment */}
      {comparison && (added > 0 || changed > 0) && (
        <div className="mt-8 bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Impact Assessment</h3>
          <div className="text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Breaking change detected — affects downstream departments
            </p>
            <p className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              Catering, Broadcasting, Ceremonies may need to re-approve
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentComparison;
