import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { deleteDesignationApi } from '../../api/admin/designationApi';

export default function DesignationDeleteModal({
  designation,
  isOpen,
  onClose,
  onDesignationDeleted,
  triggerToast
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !designation) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteDesignationApi(designation.id);
      if (res && res.success === false) {
        setError(res.message || 'Failed to delete designation');
        return;
      }

      if (triggerToast) {
        triggerToast(`Designation "${designation.name}" deleted successfully!`);
      }
      if (onDesignationDeleted) {
        onDesignationDeleted(designation.id);
      }
      onClose();
    } catch (err) {
      console.error('Delete designation error:', err);
      setError(err?.message || 'Network error deleting designation');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg font-bold">
            🗑️
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Confirm Delete Designation</h3>
            <p className="text-xs text-slate-500 m-0">
              Designation: <strong className="text-slate-800">{designation.name}</strong> (ID: #{designation.id})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-5 flex flex-col gap-2">
          <p className="m-0 font-medium text-slate-700">
            Are you sure you want to permanently delete this designation?
          </p>
          <ul className="m-0 pl-4 list-disc text-slate-500 flex flex-col gap-1">
            <li>This action cannot be undone.</li>
            <li>Users assigned to this designation might need to be reassigned.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            onClick={handleDelete}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete Designation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
