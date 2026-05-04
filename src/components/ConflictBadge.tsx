import React from 'react';

interface ConflictBadgeProps {
  severity: 'high' | 'medium' | 'low';
  count: number;
}

const severityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300',
};

const ConflictBadge: React.FC<ConflictBadgeProps> = ({ severity, count }) => {
  const colorClass = severityColors[severity] || severityColors.low;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {severity.toUpperCase()} ({count})
    </span>
  );
};

export default ConflictBadge;
