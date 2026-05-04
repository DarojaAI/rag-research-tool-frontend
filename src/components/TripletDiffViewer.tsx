import React from 'react';

interface TripletDiff {
  text: string;
  old?: string;
  new?: string;
  type: 'added' | 'removed' | 'changed';
}

interface TripletDiffViewerProps {
  diffs: TripletDiff[];
}

const TripletDiffViewer: React.FC<TripletDiffViewerProps> = ({ diffs }) => {
  return (
    <div className="space-y-2">
      {diffs.map((diff, idx) => (
        <div key={idx} className={`p-3 rounded border ${
          diff.type === 'added' ? 'bg-green-50 border-green-200' :
          diff.type === 'removed' ? 'bg-red-50 border-red-200' :
          'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="text-sm font-mono">{diff.text}</div>
          {diff.old && (
            <div className="text-xs text-red-600 mt-1">Old: {diff.old}</div>
          )}
          {diff.new && (
            <div className="text-xs text-green-600 mt-1">New: {diff.new}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripletDiffViewer;
