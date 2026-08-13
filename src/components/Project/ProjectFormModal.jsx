import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createProjectApi, updateProjectApi } from '../../api/admin/projectApi';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyData, getCompanyId } from '../../utils/storage';

export default function ProjectFormModal({
  project = null, // If project is provided, modal operates in EDIT mode; otherwise CREATE mode
  isOpen,
  onClose,
  onProjectCreated,
  onProjectUpdated,
  onSuccess,
  departments = [],
  employees = [],
  triggerToast
}) {
  const authCtx = useContext(AuthContext);
  const isEditMode = Boolean(project && project.id);

  // Fetch company details from context or cached storage
  const cachedCompanyData = authCtx?.company || getCompanyData();
  const cachedCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;
  const companyDisplayName =
    project?.company_name ||
    cachedCompanyData?.name ||
    (typeof authCtx?.companyName === 'string' && authCtx.companyName ? authCtx.companyName : '') ||
    `Company #${cachedCompanyId}`;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    project_manager: '',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    start_date: '',
    end_date: '',
    budget: '',
    description: '',
    company: cachedCompanyId
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when modal opens or project prop changes
  useEffect(() => {
    if (isOpen) {
      const activeCompanyId = authCtx?.companyId || getCompanyId() || 1;

      if (isEditMode && project) {
        setFormData({
          name: project.name || '',
          code: project.code || '',
          department: project.department ? String(project.department) : '',
          project_manager: project.project_manager ? String(project.project_manager) : '',
          status: project.status || 'ACTIVE',
          priority: project.priority || 'MEDIUM',
          start_date: project.start_date || '',
          end_date: project.end_date || '',
          budget: project.budget !== undefined && project.budget !== null ? String(project.budget) : '',
          description: project.description || '',
          company: typeof project.company === 'object' && project.company !== null
            ? (project.company.id || activeCompanyId)
            : (project.company || activeCompanyId)
        });
      } else {
        // Auto generate a project code suggestion if creating new
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const todayStr = new Date().toISOString().split('T')[0];

        setFormData({
          name: '',
          code: `PRJ-${randomSuffix}`,
          department: departments.length > 0 ? String(departments[0].id) : '',
          project_manager: '',
          status: 'ACTIVE',
          priority: 'MEDIUM',
          start_date: todayStr,
          end_date: '',
          budget: '',
          description: '',
          company: activeCompanyId
        });
      }
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, project, isEditMode, authCtx?.companyId, departments]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

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
      code: formData.code.trim(),
      company: activeCompanyId,
      status: formData.status,
      priority: formData.priority,
      start_date: formData.start_date
    };

    if (formData.department) {
      payload.department = Number(formData.department);
    } else {
      payload.department = null;
    }

    if (formData.project_manager) {
      payload.project_manager = Number(formData.project_manager);
    } else {
      payload.project_manager = null;
    }

    if (formData.end_date) {
      payload.end_date = formData.end_date;
    } else if (isEditMode) {
      payload.end_date = null;
    }

    if (formData.budget) {
      payload.budget = formData.budget;
    } else if (isEditMode) {
      payload.budget = null;
    }

    if (formData.description) {
      payload.description = formData.description.trim();
    } else if (isEditMode) {
      payload.description = '';
    }

    try {
      const apiCall = isEditMode
        ? updateProjectApi(project.id, payload)
        : createProjectApi(payload);

      const res = await apiCall;

      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        const errorMsg = res.message || (isEditMode ? 'Project update failed' : 'Project creation failed');
        setError(errorMsg);

        if (res.errors && typeof res.errors === 'object') {
          setFieldErrors(res.errors);
        } else {
          setFieldErrors({});
        }
        return;
      }

      const responseData = res?.data || res;

      // Find department name & manager name for enriched display
      const selectedDeptObj = departments.find(d => String(d.id) === String(payload.department));
      const selectedMgrObj = employees.find(e => String(e.id) === String(payload.project_manager));

      const finalProjectObj = {
        ...(project || {}),
        ...responseData,
        ...payload,
        department_name: responseData.department_name || selectedDeptObj?.name || project?.department_name || 'General',
        project_manager_name: responseData.project_manager_name || selectedMgrObj?.name || selectedMgrObj?.username || project?.project_manager_name || 'Unassigned',
        company_name: responseData.company_name || project?.company_name || companyDisplayName,
        created_at: responseData.created_at || project?.created_at || new Date().toISOString(),
        updated_at: responseData.updated_at || new Date().toISOString()
      };

      if (triggerToast) {
        triggerToast(`Project "${payload.name}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      }
      if (isEditMode && onProjectUpdated) onProjectUpdated(finalProjectObj);
      if (!isEditMode && onProjectCreated) onProjectCreated(finalProjectObj);
      if (onSuccess) onSuccess(finalProjectObj);

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update project error:' : 'Create project error:', err);
      const errMsg = err?.message || (isEditMode ? 'Failed to update project' : 'Failed to create project');
      setError(errMsg);
      if (err?.errors && typeof err.errors === 'object') {
        setFieldErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp my-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>{isEditMode ? '✏️' : '🚀'}</span>
              <span>{isEditMode ? 'Edit Project Initiative' : 'Create New Project Initiative'}</span>
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {isEditMode ? (
                <>
                  Updating project details for <strong className="text-slate-800">{project.name}</strong> (ID: #{project.id})
                </>
              ) : (
                'Configure project details, timeline, manager assignment, priority, and budget.'
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

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-cardFadeUp">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Company Display */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Organization</span>
              <span className="text-[10px] text-slate-400 font-normal">Auto-assigned company</span>
            </label>
            <input
              type="text"
              name="company_display"
              value={companyDisplayName}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-600 cursor-not-allowed select-none focus:outline-none"
            />
          </div>

          {/* Project Name & Code Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. WorkPulse Mobile App V2"
                required
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 focus:outline-none transition-all ${fieldErrors.name
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
              />
              {renderFieldError('name')}
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="PRJ-101"
                required
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-mono text-slate-900 focus:outline-none transition-all ${fieldErrors.code
                    ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600'
                    : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
              />
              {renderFieldError('code')}
            </div>
          </div>

          {/* Department & Project Manager Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Assigned Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {renderFieldError('department')}
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Manager / Lead
              </label>
              <select
                name="project_manager"
                value={formData.project_manager}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="">-- Unassigned --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.username || `User #${emp.id}`}
                  </option>
                ))}
              </select>
              {renderFieldError('project_manager')}
            </div>
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="PLANNED">📅 Planned</option>
                <option value="ACTIVE">⚡ Active / In Progress</option>
                <option value="ON_HOLD">⏸️ On Hold</option>
                <option value="COMPLETED">✅ Completed</option>
                <option value="CANCELLED">🚫 Cancelled</option>
              </select>
              {renderFieldError('status')}
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="LOW">🔵 Low Priority</option>
                <option value="MEDIUM">🟡 Medium Priority</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="CRITICAL">🔴 Critical Priority</option>
              </select>
              {renderFieldError('priority')}
            </div>
          </div>

          {/* Start Date, End Date, Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className={`w-full p-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 focus:outline-none transition-all ${fieldErrors.start_date
                    ? 'border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-600'
                  }`}
              />
              {renderFieldError('start_date')}
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                End / Target Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
              {renderFieldError('end_date')}
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Budget ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 45000"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
              {renderFieldError('budget')}
            </div>
          </div>

          {/* Description / Scope */}
          <div>
            <label className="font-semibold text-slate-700 mb-1 block">
              Project Overview & Objectives
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Outline project scope, deliverables, key target metrics..."
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            ></textarea>
            {renderFieldError('description')}
          </div>

          {/* Footer Actions */}
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
                  <span>{isEditMode ? 'Saving Changes...' : 'Launching Project...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Project Changes' : 'Confirm & Launch Project'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
