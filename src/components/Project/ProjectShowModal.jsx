import React from 'react';
import { createPortal } from 'react-dom';

export default function ProjectShowModal({
  project,
  isOpen,
  onClose,
  onEditProject,
  onDeleteProject
}) {
  if (!isOpen || !project) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  const normalizeStatus = (s) => (s || '').toString().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

  const getStatusBadgeStyle = (status) => {
    const key = normalizeStatus(status);
    switch (key) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ACTIVE':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const normalizePriority = (p) => (p || '').toString().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

  const getPriorityBadgeStyle = (priority) => {
    const key = normalizePriority(priority);
    switch (key) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp my-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Code: {project.code || `ID #${project.id}`}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeStyle(project.priority)}`}>
                {project.priority || 'MEDIUM'} PRIORITY
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 m-0 mt-2 flex items-center gap-2">
              <span>🚀</span> {project.name}
            </h3>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 text-xl font-semibold cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Details Grid */}
        <div className="flex flex-col gap-4 text-xs">
          {/* Status & Manager */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Project Status</span>
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(project.status)}`}>
                  {project.status || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Project Lead / Manager</span>
              <span className="font-bold text-slate-900">
                {project.project_manager_name || project.lead || 'Unassigned'}
              </span>
            </div>
          </div>

          {/* Department & Organization */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Department</span>
              <span className="font-bold text-slate-900">
                {project.department_name || project.dept || (project.department ? `Dept #${project.department}` : 'General')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Organization</span>
              <span className="font-bold text-slate-900">
                {project.company_name || `Company #${project.company || 1}`}
              </span>
            </div>
          </div>

          {/* Dates & Budget */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Start Date</span>
              <span className="font-bold text-slate-800">{formatDate(project.start_date)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Target / End</span>
              <span className="font-bold text-slate-800">{formatDate(project.end_date || project.deadline)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Budget</span>
              <span className="font-bold text-indigo-600">
                {project.budget ? (String(project.budget).startsWith('$') ? project.budget : `$${Number(project.budget).toLocaleString()}`) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Overview / Scope */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="font-semibold text-slate-500 block">Scope & Objectives:</span>
            <p className="text-slate-800 m-0 leading-relaxed font-medium">
              {project.description || 'No detailed scope description provided for this project.'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Created At</span>
              <span className="font-medium text-slate-700">{formatDate(project.created_at)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Updated At</span>
              <span className="font-medium text-slate-700">{formatDate(project.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            onClick={() => {
              onClose();
              if (onDeleteProject) onDeleteProject(project);
            }}
          >
            <span>🗑️</span> Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              onClick={() => {
                onClose();
                if (onEditProject) onEditProject(project);
              }}
            >
              <span>✏️</span> Edit Project
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
