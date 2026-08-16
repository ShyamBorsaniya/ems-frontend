import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createUserApi, updateUserApi, fetchRolesApi } from '../../api/admin/userApi';
import { fetchDepartmentsApi } from '../../api/admin/departmentApi';
import { fetchDesignationsApi } from '../../api/admin/designationApi';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyId } from '../../utils/storage';
import CustomSelect from '../common/CustomSelect';

export default function UserFormModal({
  user = null, // If user is provided, modal operates in EDIT mode; otherwise CREATE mode
  isOpen,
  onClose,
  onUserCreated,
  onUserUpdated,
  onSuccess,
  triggerToast
}) {
  const authCtx = useContext(AuthContext);
  const isEditMode = Boolean(user && user.id);

  // Fetch company details from context or cached storage
  const cachedCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    company: cachedCompanyId,
    role: 4, // Default to Employee (4)
    is_active: true,
    department: '',
    designation: '',
    employee_code: '',
    date_of_joining: '',
    salary: ''
  });

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(false);
  const [fetchingDepts, setFetchingDepts] = useState(false);
  const [fetchingDesgs, setFetchingDesgs] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when modal opens or user prop changes
  useEffect(() => {
    if (isOpen) {
      const activeCompanyId = authCtx?.companyId || getCompanyId() || 1;
      const empDetails = user?.employee_details || user?.employee || {};

      if (isEditMode && user) {
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '', // Blank by default when editing unless updating
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          company: typeof user.company === 'object' && user.company !== null ? (user.company.id || activeCompanyId) : (user.company || activeCompanyId),
          role: typeof user.role === 'object' && user.role !== null ? (Number(user.role.id) || 4) : (user.role !== undefined && user.role !== null && !isNaN(Number(user.role)) ? Number(user.role) : 4),
          is_active: user.is_active ?? true,
          department: user.department?.id || user.department || empDetails.department?.id || empDetails.department || '',
          designation: user.designation?.id || user.designation || empDetails.designation?.id || empDetails.designation || '',
          employee_code: user.employee_code || user.emp_id || empDetails.employee_code || empDetails.emp_id || '',
          date_of_joining: user.date_of_joining || user.joining_date || empDetails.date_of_joining || empDetails.joining_date || '',
          salary: user.salary || empDetails.salary || ''
        });
      } else {
        const randomEmpCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        const todayStr = new Date().toISOString().split('T')[0];
        setFormData({
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone: '',
          company: activeCompanyId,
          role: 4,
          is_active: true,
          department: '',
          designation: '',
          employee_code: randomEmpCode,
          date_of_joining: todayStr,
          salary: ''
        });
      }
      setError(null);
      setFieldErrors({});
      setShowPassword(false);

      // Dynamically load roles, departments, and designations from API
      const loadModalData = async () => {
        setFetchingRoles(true);
        setFetchingDepts(true);
        setFetchingDesgs(true);

        try {
          const [rolesRes, deptRes, desgRes] = await Promise.all([
            fetchRolesApi(activeCompanyId),
            fetchDepartmentsApi({ is_active: 'true' }),
            fetchDesignationsApi({ is_active: 'true' })
          ]);

          if (rolesRes && rolesRes.success && Array.isArray(rolesRes.roles) && rolesRes.roles.length > 0) {
            setRoles(rolesRes.roles);
            if (!isEditMode) {
              setFormData((prev) => ({
                ...prev,
                role: Number(rolesRes.roles[0].id)
              }));
            }
          }

          let deptList = [];
          if (deptRes && deptRes.success && deptRes.data) {
            deptList = Array.isArray(deptRes.data) ? deptRes.data : (deptRes.data.results || []);
          } else if (deptRes && Array.isArray(deptRes.data)) {
            deptList = deptRes.data;
          }
          setDepartments(deptList);

          let desgList = [];
          if (desgRes && desgRes.success && desgRes.data) {
            desgList = Array.isArray(desgRes.data) ? desgRes.data : (desgRes.data.results || []);
          } else if (desgRes && Array.isArray(desgRes.data)) {
            desgList = desgRes.data;
          }
          setDesignations(desgList);
        } catch (err) {
          console.error('Failed to load modal support data from API:', err);
        } finally {
          setFetchingRoles(false);
          setFetchingDepts(false);
          setFetchingDesgs(false);
        }
      };

      loadModalData();
    }
  }, [isOpen, user, isEditMode, authCtx?.companyId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'role' ? Number(value) : value
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
      username: formData.username.trim(),
      email: formData.email.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      company: activeCompanyId,
      role: Number(formData.role) || 4,
      is_active: formData.is_active,

      // Employee Details
      department: formData.department ? Number(formData.department) : null,
      designation: formData.designation ? Number(formData.designation) : null,
      employee_code: formData.employee_code.trim(),
      date_of_joining: formData.date_of_joining || null,
      joining_date: formData.date_of_joining || null,
      salary: formData.salary ? Number(formData.salary) : null,

      // Nested employee_details structure for Django models expecting nested JSON
      employee_details: {
        department: formData.department ? Number(formData.department) : null,
        designation: formData.designation ? Number(formData.designation) : null,
        employee_code: formData.employee_code.trim(),
        date_of_joining: formData.date_of_joining || null,
        joining_date: formData.date_of_joining || null,
        salary: formData.salary ? Number(formData.salary) : null
      }
    };

    // Include password if creating or if user provided a new password during edit
    if (!isEditMode || (isEditMode && formData.password.trim())) {
      payload.password = formData.password;
    }

    const roleNameMap = {
      1: 'super_admin',
      2: 'admin',
      3: 'hr',
      4: 'employee',
      5: 'project_manager',
      6: 'department_manager'
    };

    try {
      const apiCall = isEditMode
        ? updateUserApi(user.id, payload)
        : createUserApi(payload);

      const res = await apiCall;

      // Handle backend API error responses
      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        const errorMsg = res.message || (isEditMode ? 'User update failed' : 'User creation failed');
        setError(errorMsg);

        if (res.errors && typeof res.errors === 'object') {
          setFieldErrors(res.errors);
        } else {
          setFieldErrors({});
        }
        return; // STOP execution: do not proceed to close modal
      }

      const updatedData = res?.data || res;
      const finalUser = {
        ...(user || {}),
        ...updatedData,
        ...payload,
        role_name: updatedData.role_name || roleNameMap[payload.role] || 'employee',
        updated_at: new Date().toISOString(),
        created_at: user?.created_at || new Date().toISOString()
      };

      if (triggerToast) {
        triggerToast(`User "${payload.username}" ${isEditMode ? 'updated' : 'created'} successfully!`);
      }
      if (isEditMode && onUserUpdated) onUserUpdated(finalUser);
      if (!isEditMode && onUserCreated) onUserCreated(finalUser);
      if (onSuccess) onSuccess(finalUser);

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update user error:' : 'Create user error:', err);
      const errMsg = err?.message || (isEditMode ? 'Failed to update user' : 'Failed to create user');
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
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>{isEditMode ? '✏️' : '👤'}</span>
              <span>{isEditMode ? 'Edit User Account' : 'Onboard New User'}</span>
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {isEditMode ? (
                <>
                  Update user details for <strong className="text-slate-800">@{user.username}</strong> (ID: #{user.id})
                </>
              ) : (
                'Fill in the user account details to create a new user profile.'
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

        {/* User Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                    fieldErrors.first_name
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
                {renderFieldError('first_name')}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                    fieldErrors.last_name
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
                {renderFieldError('last_name')}
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="user"
                  required
                  className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                    fieldErrors.username
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
                {renderFieldError('username')}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@gmail.com"
                  required
                  className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                    fieldErrors.email
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
                {renderFieldError('email')}
              </div>
            </div>

            {/* Password & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>
                    Password {!isEditMode && <span className="text-rose-500">*</span>}
                  </span>
                  {isEditMode && (
                    <span className="text-[10px] text-slate-400 font-normal">Leave empty to keep unchanged</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditMode ? '••••••••' : 'User@123'}
                    required={!isEditMode}
                    className={`w-full p-2.5 pr-10 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                      fieldErrors.password
                        ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {renderFieldError('password')}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`w-full p-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-all ${
                    fieldErrors.phone
                      ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
                {renderFieldError('phone')}
              </div>
            </div>

            {/* User Role */}
            <div>
              {fetchingRoles ? (
                <div className="text-xs text-slate-500 py-2.5 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Loading available roles...</span>
                </div>
              ) : (
                <CustomSelect
                  label="User Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  error={fieldErrors.role}
                  placeholder="-- Select User Role --"
                  options={
                    roles.length > 0
                      ? roles.map((r) => ({
                          value: Number(r.id),
                          label: r.name || r.title || r.role_name || r.display_name || `Role #${r.id}`
                        }))
                      : [
                          { value: 1, label: 'Super Admin (Role 1)' },
                          { value: 2, label: 'Admin (Role 2)' },
                          { value: 3, label: 'HR (Role 3)' },
                          { value: 4, label: 'Employee (Role 4)' },
                          { value: 5, label: 'Project Manager (Role 5)' },
                          { value: 6, label: 'Department Manager (Role 6)' }
                        ]
                  }
                />
              )}
            </div>

            {/* Employee Details & Assignment Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🏢</span> Employee Details & Job Mapping
              </h4>

              {/* Employee Code & Date of Joining */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Employee Code / ID
                  </label>
                  <input
                    type="text"
                    name="employee_code"
                    value={formData.employee_code}
                    onChange={handleChange}
                    placeholder="e.g. EMP-1001"
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  {renderFieldError('employee_code')}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    name="date_of_joining"
                    value={formData.date_of_joining}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  {renderFieldError('date_of_joining')}
                </div>
              </div>

              {/* Department & Designation Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CustomSelect
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  error={fieldErrors.department}
                  placeholder={fetchingDepts ? "Loading departments..." : "-- Select Department --"}
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: `${dept.name} (${dept.code || `#${dept.id}`})`
                  }))}
                />

                <CustomSelect
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  error={fieldErrors.designation}
                  placeholder={fetchingDesgs ? "Loading designations..." : "-- Select Designation --"}
                  options={designations.map((desg) => ({
                    value: desg.id,
                    label: `${desg.name} (${desg.code || `#${desg.id}`})`
                  }))}
                />
              </div>

              {/* Salary */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Salary / Base Pay ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 65000"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                {renderFieldError('salary')}
              </div>
            </div>

            {/* Account Status Switch (Edit & Create Mode) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Account Status</span>
                <span className="text-[11px] text-slate-500 block">Enable or disable user portal access</span>
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
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating User...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save User Changes' : 'Confirm & Onboard User'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
