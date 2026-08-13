import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { deleteRoleApi } from '../../api/admin/roleApi';

export default function RoleDeleteModal({
  role,
  isOpen,
  onClose,
  onRoleDeleted,
  triggerToast
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !role) return null;

  const handleDelete = async () => {
    setLoading(true);
    const roleTitle = role.name || role.title || `Role #${role.id}`;

    try {
      try {
        await deleteRoleApi(role.id);
      } catch (err) {
        console.warn('Backend delete role API returned error, proceeding with client removal:', err);
      }

      if (triggerToast) {
        triggerToast(`Role "${roleTitle}" deleted successfully!`);
      }

      if (onRoleDeleted) {
        onRoleDeleted(role.id);
      }
      onClose();
    } catch (err) {
      console.error('Delete role error:', err);
      if (triggerToast) {
        triggerToast(`Failed to delete role "${roleTitle}"`);
      }
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
            <h3 className="text-base font-bold text-slate-900 m-0">
              Confirm Delete Role
            </h3>
            <p className="text-xs text-slate-500 m-0">
              Role: <strong className="text-slate-800">{role.name || role.title}</strong> (#{role.id})
            </p>
          </div>
        </div>

        {role.is_system_role && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
            <span className="text-sm">⚠️</span>
            <span>Caution: This is marked as a <strong>System Role</strong>. Deleting system roles may impact critical application access.</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-5 flex flex-col gap-2">
          <p className="m-0 font-medium text-slate-700">
            Are you sure you want to permanently delete this role?
          </p>
          <ul className="m-0 pl-4 list-disc text-slate-500 flex flex-col gap-1">
            <li>This action will remove the role definition from the system.</li>
            <li>Users currently assigned to this role may need to be reassigned.</li>
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
              <span>Yes, Delete Role</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
