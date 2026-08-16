import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createDesignationApi, updateDesignationApi } from '../../api/admin/designationApi';
import { fetchDepartmentsApi } from '../../api/admin/departmentApi';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyData, getCompanyId } from '../../utils/storage';
import CustomSelect from '../common/CustomSelect';

export default function DesignationFormModal({
  designation = null, // If designation is provided, modal operates in EDIT mode; otherwise CREATE mode
  isOpen,
  onClose,
  onDesignationCreated,
  onDesignationUpdated,
  onSuccess,
  triggerToast
}) {
  const authCtx = useContext(AuthContext);
  const isEditMode = Boolean(designation && designation.id);

  // Fetch company details from context or cached storage
  const cachedCompanyData = authCtx?.company || getCompanyData();
  const cachedCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;
  const companyDisplayName =
    designation?.company_name ||
    cachedCompanyData?.name ||
    (typeof authCtx?.companyName === 'string' && authCtx.companyName ? authCtx.companyName : '') ||
    `Company #${cachedCompanyId}`;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    description: '',
    company: cachedCompanyId,
    is_active: true
  });

  const [departments, setDepartments] = useState([]);
  const [fetchingDepts, setFetchingDepts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when modal opens or designation prop changes
  useEffect(() => {
    if (isOpen) {
      const activeCompanyId = authCtx?.companyId || getCompanyId() || 1;

      if (isEditMode && designation) {
        const deptVal = typeof designation.department === 'object' && designation.department !== null
          ? String(designation.department.id || '')
          : String(designation.department || '');
        setFormData({
          name: designation.name || '',
          code: designation.code || '',
          department: deptVal,
          description: designation.description || '',
          company: typeof designation.company === 'object' && designation.company !== null
            ? (designation.company.id || activeCompanyId)
            : (designation.company || activeCompanyId),
          is_active: designation.is_active ?? true
        });
      } else {
        setFormData({
          name: '',
          code: '',
          department: '',
          description: '',
          company: activeCompanyId,
          is_active: true
        });
      }
      setError(null);
      setFieldErrors({});

      const loadDepts = async () => {
        setFetchingDepts(true);
        try {
          const res = await fetchDepartmentsApi({ is_active: 'true' });
          let deptList = [];
          if (res && res.success && res.data) {
            if (Array.isArray(res.data)) {
              deptList = res.data;
            } else if (res.data.results) {
              deptList = Array.isArray(res.data.results) ? res.data.results : [];
            }
          } else if (res && Array.isArray(res.data)) {
            deptList = res.data;
          }
          setDepartments(deptList);

          // Auto-select first department if list is not empty and not in edit mode
          if (!isEditMode && deptList.length > 0) {
            setFormData((prev) => ({
              ...prev,
              department: String(deptList[0].id)
            }));
          }
        } catch (err) {
          console.error('Failed to load active departments:', err);
        } finally {
          setFetchingDepts(false);
        }
      };

      loadDepts();
    }
  }, [isOpen, designation, isEditMode, authCtx?.companyId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error for this field on user input
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

    if (!formData.department) {
      setError('Please select a department.');
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
      department: Number(formData.department),
      company: activeCompanyId,
      is_active: formData.is_active
    };

    try {
      const apiCall = isEditMode
        ? updateDesignationApi(designation.id, payload)
        : createDesignationApi(payload);

      const res = await apiCall;

      // Handle backend API error responses
      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        let errorMsg = res.message || (isEditMode ? 'Designation update failed' : 'Designation creation failed');
        if (res.errors && res.errors.non_field_errors) {
          const nonFieldErr = res.errors.non_field_errors;
          const nonFieldMsg = Array.isArray(nonFieldErr) ? nonFieldErr.join(' ') : String(nonFieldErr);
          errorMsg = `${errorMsg}: ${nonFieldMsg}`;
        }
        setError(errorMsg);

        if (res.errors && typeof res.errors === 'object') {
          setFieldErrors(res.errors);
        } else {
          setFieldErrors({});
        }
        return;
      }

      const responseData = res?.data || res;
      const mappedDept = departments.find(d => Number(d.id) === Number(payload.department)) || designation?.department || null;

      const finalDesgObj = {
        ...(designation || {}),
        ...responseData,
        ...payload,
        department: mappedDept,
        company_name: responseData.company_name || designation?.company_name || companyDisplayName,
        created_at: responseData.created_at || designation?.created_at || new Date().toISOString(),
        updated_at: responseData.updated_at || new Date().toISOString()
      };

      if (triggerToast) {
        triggerToast(`Designation "${payload.name}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      }
      if (isEditMode && onDesignationUpdated) {
        onDesignationUpdated(finalDesgObj);
      }
      if (!isEditMode && onDesignationCreated) {
        onDesignationCreated(finalDesgObj);
      }
      if (onSuccess) {
        onSuccess(finalDesgObj);
      }

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update designation error:' : 'Create designation error:', err);
      let errMsg = err?.message || (isEditMode ? 'Failed to update designation' : 'Failed to create designation');
      if (err?.errors && err.errors.non_field_errors) {
        const nonFieldErr = err.errors.non_field_errors;
        const nonFieldMsg = Array.isArray(nonFieldErr) ? nonFieldErr.join(' ') : String(nonFieldErr);
        errMsg = `${errMsg}: ${nonFieldMsg}`;
      }
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
              <span>{isEditMode ? '✏️' : '🏷️'}</span>
              <span>{isEditMode ? 'Edit Designation' : 'Create New Designation'}</span>
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {isEditMode ? (
                <>
                  Updating designation details for <strong className="text-slate-800">{designation.name}</strong> (ID: #{designation.id})
                </>
              ) : (
                'Configure designation title, department mapping, and code.'
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

        {/* Designation Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Global Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-cardFadeUp">
                <span className="text-sm">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Designation Title */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Designation Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer, Lead HR Specialist..."
                required
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                  fieldErrors.name
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                }`}
              />
              {renderFieldError('name')}
            </div>

            {/* Designation Code */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Designation Code / Tag
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. SSE-01, HR-LEAD"
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm font-mono text-slate-900 focus:outline-none transition-all ${
                  fieldErrors.code
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                }`}
              />
              {renderFieldError('code')}
            </div>

            {/* Department Dropdown */}
            <div>
              {fetchingDepts ? (
                <div className="text-xs text-slate-500 py-2.5 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Loading active departments...</span>
                </div>
              ) : (
                <CustomSelect
                  label="Assigned Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  error={fieldErrors.department}
                  placeholder="-- Select Department --"
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: `${dept.name} (${dept.code || `#${dept.id}`})`
                  }))}
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Description & Job Responsibilities
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of key roles and responsibilities for this designation..."
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
                <span className="text-xs font-bold text-slate-800 block">Designation Status</span>
                <span className="text-[11px] text-slate-500 block">Set operational availability for user assignment</span>
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
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Designation Changes' : 'Confirm & Save'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
