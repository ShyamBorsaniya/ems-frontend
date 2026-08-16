import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createDepartmentApi, updateDepartmentApi } from '../../api/admin/departmentApi';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyData, getCompanyId } from '../../utils/storage';

export default function DepartmentFormModal({
  department = null, // If department is provided, modal operates in EDIT mode; otherwise CREATE mode
  isOpen,
  onClose,
  onDepartmentCreated,
  onDepartmentUpdated,
  onSuccess,
  triggerToast
}) {
  const authCtx = useContext(AuthContext);
  const isEditMode = Boolean(department && department.id);

  // Fetch company details from context or cached storage
  const cachedCompanyData = authCtx?.company || getCompanyData();
  const cachedCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;
  const companyDisplayName =
    department?.company_name ||
    cachedCompanyData?.name ||
    (typeof authCtx?.companyName === 'string' && authCtx.companyName ? authCtx.companyName : '') ||
    `Company #${cachedCompanyId}`;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company: cachedCompanyId,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when modal opens or department prop changes
  useEffect(() => {
    if (isOpen) {
      const activeCompanyId = authCtx?.companyId || getCompanyId() || 1;

      if (isEditMode && department) {
        setFormData({
          name: department.name || '',
          description: department.description || '',
          company: typeof department.company === 'object' && department.company !== null
            ? (department.company.id || activeCompanyId)
            : (department.company || activeCompanyId),
          is_active: department.is_active ?? true
        });
      } else {
        setFormData({
          name: '',
          description: '',
          company: activeCompanyId,
          is_active: true
        });
      }
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, department, isEditMode, authCtx?.companyId]);

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
      is_active: formData.is_active
    };

    try {
      const apiCall = isEditMode
        ? updateDepartmentApi(department.id, payload)
        : createDepartmentApi(payload);

      const res = await apiCall;

      // Handle backend API error responses
      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        const errorMsg = res.message || (isEditMode ? 'Department update failed' : 'Department creation failed');
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
      const finalDeptObj = {
        ...(department || {}),
        ...responseData,
        ...payload,
        company_name: responseData.company_name || department?.company_name || companyDisplayName,
        created_at: responseData.created_at || department?.created_at || new Date().toISOString(),
        updated_at: responseData.updated_at || new Date().toISOString()
      };

      if (triggerToast) {
        triggerToast(`Department "${payload.name}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      }
      if (isEditMode && onDepartmentUpdated) onDepartmentUpdated(finalDeptObj);
      if (!isEditMode && onDepartmentCreated) onDepartmentCreated(finalDeptObj);
      if (onSuccess) onSuccess(finalDeptObj);

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update department error:' : 'Create department error:', err);
      const errMsg = err?.message || (isEditMode ? 'Failed to update department' : 'Failed to create department');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>{isEditMode ? '✏️' : '🏢'}</span>
              <span>{isEditMode ? 'Edit Department' : 'Create New Department'}</span>
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {isEditMode ? (
                <>
                  Updating details for department <strong className="text-slate-800">{department.name}</strong> (ID: #{department.id})
                </>
              ) : (
                'Configure department title, description, and status for your organization.'
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

        {/* Department Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Global Error Alert Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-cardFadeUp">
                <span className="text-sm">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Department Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Engineering & Product, Human Resources..."
                required
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                  fieldErrors.name
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                }`}
              />
              {renderFieldError('name')}
            </div>

            {/* Department Code */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Department Code / Identifier
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. ENG, HR, MKT"
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm font-mono text-slate-900 focus:outline-none transition-all ${
                  fieldErrors.code
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                }`}
              />
              {renderFieldError('code')}
            </div>

            {/* Department Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Description & Purpose
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the responsibilities and scope of this department..."
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all resize-none ${
                  fieldErrors.description
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                }`}
              />
              {renderFieldError('description')}
            </div>

            {/* Operational Status Switch */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Department Status</span>
                <span className="text-[11px] text-slate-500 block">Set operational status across user assignments</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-700">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          {/* Fixed Actions Footer */}
          <div className="flex justify-end gap-3 p-6 py-4 border-t border-slate-100 bg-white shrink-0">
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
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating Department...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Department Changes' : 'Confirm & Save Department'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
