import React from 'react';
import { createPortal } from 'react-dom';

export default function RoleShowModal({
  role,
  isOpen,
  onClose,
  onEditRole,
  onDeleteRole
}) {
  if (!isOpen || !role) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp my-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl font-bold">
              🔑
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 m-0">
                {role.name || role.title}
              </h3>
              <p className="text-xs text-slate-500 m-0">
                Role ID: <span className="font-semibold text-slate-700">#{role.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 text-xl font-semibold cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body Info */}
        <div className="flex flex-col gap-4">
          {/* System Role Badge / Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Role Classification
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {role.is_system_role ? 'Core System Role' : 'Custom Enterprise Role'}
              </span>
            </div>
            {role.is_system_role ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                🛡️ System Role
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                👤 Custom Role
              </span>
            )}
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Description & Scope
            </span>
            <p className="text-xs text-slate-700 leading-relaxed m-0 whitespace-pre-wrap">
              {role.description || 'No description provided for this role.'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Created Date</span>
              <span className="text-xs font-semibold text-slate-700">{formatDate(role.created_at)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Last Updated</span>
              <span className="text-xs font-semibold text-slate-700">{formatDate(role.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
          {onDeleteRole && (
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              onClick={() => {
                onClose();
                onDeleteRole(role);
              }}
            >
              <span>🗑️</span> Delete Role
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              onClick={onClose}
            >
              Close
            </button>
            {onEditRole && (
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer flex items-center gap-1.5"
                onClick={() => {
                  onClose();
                  onEditRole(role);
                }}
              >
                <span>✏️</span> Edit Role
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
