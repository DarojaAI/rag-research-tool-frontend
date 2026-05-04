import React from 'react';

interface TimelineItemProps {
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, timestamp, actor, isLast }) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-blue-600 rounded-full" />
        {!isLast && <div className="w-0.5 bg-gray-300 flex-1 mt-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
        <div className="text-xs text-gray-400 mt-1">
          {actor} • {new Date(timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
