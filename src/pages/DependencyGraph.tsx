import React from 'react';
import DependencyNetworkGraph from '../components/DependencyNetworkGraph';

const nodes = [
  { id: 'transport', label: 'Transport', type: 'service' },
  { id: 'venues', label: 'Venues', type: 'location' },
  { id: 'catering', label: 'Catering', type: 'service' },
  { id: 'broadcasting', label: 'Broadcasting', type: 'media' },
  { id: 'ceremonies', label: 'Ceremonies', type: 'event' },
];

const edges = [
  { source: 'transport', target: 'venues', label: 'DELIVERS_TO' },
  { source: 'venues', target: 'catering', label: 'HOSTS' },
  { source: 'catering', target: 'broadcasting', label: 'SUPPORTS' },
  { source: 'venues', target: 'ceremonies', label: 'HOSTS' },
  { source: 'transport', target: 'catering', label: 'REQUIRES' },
];

const DependencyGraph: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dependency Graph</h2>
      <p className="text-sm text-gray-500 mb-6">Click a node to see deliverables and policies. Highlight impact of changes.</p>
      <DependencyNetworkGraph nodes={nodes} edges={edges} />
    </div>
  );
};

export default DependencyGraph;
