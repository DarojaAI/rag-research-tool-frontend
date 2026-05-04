import React, { useRef, useEffect } from 'react';
import * as cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';

cytoscape.use(cola);

interface NodeData {
  id: string;
  label: string;
  type: string;
}

interface EdgeData {
  source: string;
  target: string;
  label: string;
}

interface DependencyNetworkGraphProps {
  nodes: NodeData[];
  edges: EdgeData[];
  onNodeClick?: (nodeId: string) => void;
}

const DependencyNetworkGraph: React.FC<DependencyNetworkGraphProps> = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      ...nodes.map(n => ({ data: { id: n.id, label: n.label, type: n.type } })),
      ...edges.map(e => ({ data: { source: e.source, target: e.target, label: e.label } }),
    ];

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        { selector: 'node', style: { label: 'data(label)', width: 80, height: 40, backgroundColor: '#3b82f6', color: '#fff', textFontSize: 12, textValign: 'center', textHalign: 'center' } },
        { selector: 'edge', style: { label: 'data(label)', width: 2, lineColor: '#94a3b8', color: '#64748b', fontSize: 10, curveStyle: 'bezier' } },
      ],
      layout: { name: 'cola', animate: true },
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      onNodeClick?.(node.id());
    });

    return () => { cyRef.current?.destroy(); };
  }, [nodes, edges, onNodeClick]);

  return <div ref={containerRef} className="w-full h-96 border rounded-lg" />;
};

export default DependencyNetworkGraph;
