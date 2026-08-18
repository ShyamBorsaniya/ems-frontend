import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function OverviewSummary({
  adminName = 'User',
  employees = [],
  projects = [],
  triggerToast
}) {
  const { hasPermission } = useAuth();
  const canViewUsers = hasPermission('user:view');
  const canViewProjects = hasPermission('project:view');
  const normalizeStatus = (s) => (s || '').toString().toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  const inProgressProjectsCount = projects.filter(p => normalizeStatus(p.status) === 'ACTIVE').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">Welcome, {adminName.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">WorkPulse Management Console — Streamlining users, projects, and departments.</p>
        </div>
      </div>




    </div>
  );
}
