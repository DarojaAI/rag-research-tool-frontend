import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApprovalQueue from './pages/ApprovalQueue';
import AuditTrail from './pages/AuditTrail';
import MultiEventDashboard from './pages/MultiEventDashboard';
import RealtimeStatus from './pages/RealtimeStatus';
import DependencyGraph from './pages/DependencyGraph';
import DocumentComparison from './pages/DocumentComparison';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">FortEvent</h1>
          <div className="flex gap-2">
            <a href="/approvals" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Approvals</a>
            <a href="/audit" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Audit Trail</a>
            <a href="/dashboard" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Dashboard</a>
            <a href="/status" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Status</a>
            <a href="/graph" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Graph</a>
            <a href="/compare" className="px-3 py-1 text-gray-500 rounded text-sm hover:bg-gray-100">Compare</a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/approvals" replace />} />
          <Route path="/approvals" element={<ApprovalQueue />} />
          <Route path="/audit" element={<AuditTrail />} />
          <Route path="/dashboard" element={<MultiEventDashboard />} />
          <Route path="/status" element={<RealtimeStatus />} />
          <Route path="/graph" element={<DependencyGraph />} />
          <Route path="/compare" element={<DocumentComparison />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
