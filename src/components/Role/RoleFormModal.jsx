import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createRoleApi, updateRoleApi } from '../../api/admin/roleApi';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyData, getCompanyId } from '../../utils/storage';

export default function RoleFormModal({
  role = null, // If role is provided, modal operates in EDIT mode; otherwise CREATE mode
  isOpen,
  onClose,
  onRoleCreated,
  onRoleUpdated,
  onSuccess,
  triggerToast
}) {
  const authCtx = useContext(AuthContext);
  const isEditMode = Boolean(role && role.id);

  // Fetch company details from context or cached storage
  const cachedCompanyData = authCtx?.company || getCompanyData();
  const cachedCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;
  const companyDisplayName =
    cachedCompanyData?.name ||
    (typeof authCtx?.companyName === 'string' && authCtx.companyName ? authCtx.companyName : '') ||
    `Company #${cachedCompanyId}`;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company: cachedCompanyId,
    is_system_role: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when modal opens or role prop changes
  useEffect(() => {
    if (isOpen) {
      const activeCompanyId = authCtx?.companyId || getCompanyId() || 1;

      if (isEditMode && role) {
        setFormData({
          name: role.name || role.title || '',
          description: role.description || '',
          company: typeof role.company === 'object' && role.company !== null ? (role.company.id || activeCompanyId) : (role.company || activeCompanyId),
          is_system_role: Boolean(role.is_system_role)
        });
      } else {
        setFormData({
          name: '',
          description: '',
          company: activeCompanyId,
          is_system_role: false
        });
      }
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, role, isEditMode, authCtx?.companyId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error for this field on user typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const activeCompanyId = Number(authCtx?.companyId || getCompanyId() || formData.company) || 1;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      company: activeCompanyId,
      is_system_role: Boolean(formData.is_system_role)
    };

    try {
      const apiCall = isEditMode
        ? updateRoleApi(role.id, payload)
        : createRoleApi(payload);

      const res = await apiCall;

      // Handle backend API error responses (e.g. status 400 Bad Request with success: false or errors object)
      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        const errorMsg = res.message || (isEditMode ? 'Role update failed' : 'Role creation failed');
        setError(errorMsg);

        if (res.errors && typeof res.errors === 'object') {
          setFieldErrors(res.errors);
        } else {
          setFieldErrors({});
        }
        return; // STOP execution: do not proceed to close modal
      }

      // Success path
      const responseData = res?.data || res;
      const finalRoleObj = {
        ...(role || {}),
        ...responseData,
        ...payload,
        company_name: responseData.company_name || role?.company_name || companyDisplayName,
        created_at: responseData.created_at || role?.created_at || new Date().toISOString(),
        updated_at: responseData.updated_at || new Date().toISOString()
      };

      if (triggerToast) {
        triggerToast(`Role "${payload.name}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      }
      if (isEditMode && onRoleUpdated) onRoleUpdated(finalRoleObj);
      if (!isEditMode && onRoleCreated) onRoleCreated(finalRoleObj);
      if (onSuccess) onSuccess(finalRoleObj);

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update role error:' : 'Create role error:', err);
      const errMsg = err?.message || (isEditMode ? 'Failed to update role' : 'Failed to create role');
      setError(errMsg);
      if (err?.errors && typeof err.errors === 'object') {
        setFieldErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper renderer for field-level error messages
  const renderFieldError = (fieldName) => {
    const errVal = fieldErrors[fieldName];
    if (!errVal) return null;
    const message = Array.isArray(errVal) ? errVal.join(' ') : String(errVal);
    return (
      <span className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
        <span>⚠️</span>
        <span>{message}</span>
      </span>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp my-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>{isEditMode ? '✏️' : '🔑'}</span>
              <span>{isEditMode ? 'Edit Enterprise Role' : 'Define New Enterprise Role'}</span>
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {isEditMode ? (
                <>
                  Updating details for role <strong className="text-slate-800">{role.name || role.title}</strong> (ID: #{role.id})
                </>
              ) : (
                'Configure title and scope of permissions for a system role.'
              )}
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 text-xl font-semibold cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Global Error Alert Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-cardFadeUp">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Role Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company Display */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Assigned Organization</span>
              <span className="text-[10px] text-slate-400 font-normal">Auto-assigned to your company</span>
            </label>
            <input
              type="text"
              name="company_display"
              value={companyDisplayName}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-sm font-semibold text-slate-600 cursor-not-allowed select-none focus:outline-none"
            />
            {renderFieldError('company')}
          </div>

          {/* Role Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">
              Role Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Senior Developer, Department Manager..."
              className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                fieldErrors.name
                  ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
              }`}
            />
            {renderFieldError('name')}
          </div>

          {/* Role Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">
              Role Scope & Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the responsibility and scope of this role..."
              className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                fieldErrors.description
                  ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
              }`}
            ></textarea>
            {renderFieldError('description')}
          </div>

          {/* Is System Role Checkbox / Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="is_system_role" className="text-xs font-semibold text-slate-800 cursor-pointer block">
                System Role Status
              </label>
              <p className="text-[11px] text-slate-500 m-0">
                Designate as a core system role (pre-defined system permission scope)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                id="is_system_role"
                name="is_system_role"
                checked={Boolean(formData.is_system_role)}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          {renderFieldError('is_system_role')}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{isEditMode ? 'Saving Changes...' : 'Saving Role...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Role Changes' : 'Confirm & Save Role'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
