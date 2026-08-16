import React from 'react';
import { createPortal } from 'react-dom';

export default function DepartmentShowModal({
  department,
  isOpen,
  onClose,
  onEditDepartment,
  onDeleteDepartment
}) {
  if (!isOpen || !department) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>🏢</span> {department.name}
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

        {/* Scrollable Details Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
          {/* Status */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-slate-500">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                department.is_active
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span className={department.is_active ? 'text-emerald-500' : 'text-slate-400'}>●</span>
              {department.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="font-semibold text-slate-500 block">Scope & Description:</span>
            <p className="text-slate-800 m-0 leading-relaxed font-medium">
              {department.description || 'No specific description provided for this department.'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Created At</span>
              <span className="font-medium text-slate-700">{formatDate(department.created_at)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Updated At</span>
              <span className="font-medium text-slate-700">{formatDate(department.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons Footer */}
        <div className="flex justify-end items-center p-6 py-4 border-t border-slate-100 bg-white shrink-0">
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
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
