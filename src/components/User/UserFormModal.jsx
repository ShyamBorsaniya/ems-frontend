import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { onboardUserApi, fetchRolesApi } from '../../api/admin/userApi';
import { fetchDeptDesignationsApi } from '../../api/admin/departmentApi';
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
    status: 'approve', // Default status: Approved

    // Employee Details
    code: '',
    department: '',
    designation: '',
    joining_date: '',
    employment_type: 'full_time',
    employment_status: 'active',
    date_of_birth: '',
    gender: 'male',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [roles, setRoles] = useState([]);
  const [deptDesignations, setDeptDesignations] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(false);
  const [fetchingDepts, setFetchingDepts] = useState(false);

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
          password: '', // Blank by default when editing
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          company: typeof user.company === 'object' && user.company !== null ? (user.company.id || activeCompanyId) : (user.company || activeCompanyId),
          role: typeof user.role === 'object' && user.role !== null ? (Number(user.role.id) || 4) : (user.role !== undefined && user.role !== null && !isNaN(Number(user.role)) ? Number(user.role) : 4),
          is_active: user.is_active ?? true,
          status: user.status || 'approve',

          // Employee Details
          code: empDetails.code || empDetails.employee_code || user.employee_code || user.emp_id || '',
          department: empDetails.department?.id || empDetails.department || user.department?.id || user.department || '',
          designation: empDetails.designation?.id || empDetails.designation || user.designation?.id || user.designation || '',
          joining_date: empDetails.joining_date || empDetails.date_of_joining || user.joining_date || user.date_of_joining || '',
          employment_type: empDetails.employment_type || 'full_time',
          employment_status: empDetails.employment_status || 'active',
          date_of_birth: empDetails.date_of_birth || '',
          gender: empDetails.gender || 'male',
          address: empDetails.address || '',
          emergency_contact_name: empDetails.emergency_contact_name || '',
          emergency_contact_phone: empDetails.emergency_contact_phone || ''
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
          status: 'approve',

          // Employee Details
          code: randomEmpCode,
          department: '',
          designation: '',
          joining_date: todayStr,
          employment_type: 'full_time',
          employment_status: 'active',
          date_of_birth: '',
          gender: 'male',
          address: '',
          emergency_contact_name: '',
          emergency_contact_phone: ''
        });
      }
      setError(null);
      setFieldErrors({});
      setShowPassword(false);

      // Dynamically load roles, departments, and designations from API
      const loadModalData = async () => {
        setFetchingRoles(true);
        setFetchingDepts(true);

        try {
          const [rolesRes, deptRes] = await Promise.all([
            fetchRolesApi(activeCompanyId),
            fetchDeptDesignationsApi()
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
            deptList = Array.isArray(deptRes.data) ? deptRes.data : [];
          } else if (deptRes && Array.isArray(deptRes.data)) {
            deptList = deptRes.data;
          }
          setDeptDesignations(deptList);

          // If in edit mode, and department is not set but designation is set, auto-resolve department
          if (isEditMode && empDetails && empDetails.designation && !empDetails.department) {
            const desgId = Number(empDetails.designation.id || empDetails.designation);
            const resolvedDept = deptList.find(d =>
              d.designations?.some(desg => Number(desg.id) === desgId)
            );
            if (resolvedDept) {
              setFormData(prev => ({
                ...prev,
                department: resolvedDept.id
              }));
            }
          }
        } catch (err) {
          console.error('Failed to load modal support data from API:', err);
        } finally {
          setFetchingRoles(false);
          setFetchingDepts(false);
        }
      };

      loadModalData();
    }
  }, [isOpen, user, isEditMode, authCtx?.companyId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : name === 'role' ? Number(value) : value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: finalValue
      };
      if (name === 'department') {
        updated.designation = ''; // Reset designation when department changes
      }
      return updated;
    });

    // Clear field-level error when user changes input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }

    // Also check for nested employee_details error to clear
    if (fieldErrors.employee_details?.[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        employee_details: {
          ...prev.employee_details,
          [name]: null
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const newFieldErrors = {};

    if (!formData.first_name || !formData.first_name.trim()) {
      newFieldErrors.first_name = ['Please enter your first name.'];
    }
    if (!formData.last_name || !formData.last_name.trim()) {
      newFieldErrors.last_name = ['Please enter your last name.'];
    }
    if (!formData.username || !formData.username.trim()) {
      newFieldErrors.username = ['Please enter a username.'];
    }
    if (!formData.email || !formData.email.trim()) {
      newFieldErrors.email = ['Please enter your email address.'];
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newFieldErrors.email = ['The email field must be a valid email address.'];
      }
    }
    if (!isEditMode && !formData.password) {
      newFieldErrors.password = ['Please enter a password.'];
    } else if (formData.password && formData.password.length < 8) {
      newFieldErrors.password = ['Password must be at least 8 characters long.'];
    }
    if (!formData.role) {
      newFieldErrors.role = ['Please select a user role.'];
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newFieldErrors.phone = ['Please enter a valid phone number (10-15 digits, optional +).'];
      }
    }

    if (formData.emergency_contact_phone && formData.emergency_contact_phone.trim()) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.emergency_contact_phone.trim())) {
        if (!newFieldErrors.employee_details) {
          newFieldErrors.employee_details = {};
        }
        newFieldErrors.employee_details.emergency_contact_phone = ['Please enter a valid phone number (10-15 digits, optional +).'];
      }
    }

    if (!formData.department) {
      if (!newFieldErrors.employee_details) {
        newFieldErrors.employee_details = {};
      }
      newFieldErrors.employee_details.department = ['Please select a department.'];
    }

    if (!formData.designation) {
      if (!newFieldErrors.employee_details) {
        newFieldErrors.employee_details = {};
      }
      newFieldErrors.employee_details.designation = ['Please select a designation.'];
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    const activeCompanyId = Number(authCtx?.companyId || getCompanyId() || formData.company) || 1;

    // Build payload structure to match exact requirements
    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
      company: activeCompanyId,
      role: Number(formData.role) || 4,
      status: formData.status,
      is_active: formData.is_active,

      employee_details: {
        code: formData.code.trim(),
        department: formData.department ? Number(formData.department) : null,
        designation: formData.designation ? Number(formData.designation) : null,
        joining_date: formData.joining_date || null,
        employment_type: formData.employment_type || null,
        employment_status: formData.employment_status || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        address: formData.address?.trim() || null,
        emergency_contact_name: formData.emergency_contact_name?.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone?.trim() || null
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

    if (isEditMode) {
      payload.id = user.id;
    }

    try {
      const apiCall = onboardUserApi(payload);

      const res = await apiCall;

      // Handle backend API error responses
      if (res && (res.success === false || (res.status_code && res.status_code >= 400) || res.errors)) {
        const errorMsg = res.message || (isEditMode ? 'User update failed' : 'User onboarding failed');
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
        triggerToast(`User "${payload.username}" ${isEditMode ? 'updated' : 'onboarded'} successfully!`);
      }
      if (isEditMode && onUserUpdated) onUserUpdated(finalUser);
      if (!isEditMode && onUserCreated) onUserCreated(finalUser);
      if (onSuccess) onSuccess(finalUser);

      onClose();
    } catch (err) {
      console.error(isEditMode ? 'Update user error:' : 'Onboard user error:', err);
      const errMsg = err?.message || (isEditMode ? 'Failed to update user' : 'Failed to onboard user');
      setError(errMsg);
      if (err?.errors && typeof err.errors === 'object') {
        setFieldErrors(err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper renderer to fetch error message as string
  const getFieldErrorString = (fieldName) => {
    let errVal = fieldErrors[fieldName];
    if (!errVal && fieldName.startsWith('employee_details.')) {
      const subKey = fieldName.split('.')[1];
      errVal = fieldErrors.employee_details?.[subKey];
    }
    if (!errVal) return '';
    return Array.isArray(errVal) ? errVal.join(' ') : String(errVal);
  };

  // Helper renderer for field-level error messages
  const renderFieldError = (fieldName) => {
    const message = getFieldErrorString(fieldName);
    if (!message) return null;
    return (
      <p className="text-xs text-rose-600 mt-0.5">{message}</p>
    );
  };

  const selectedDeptId = Number(formData.department);
  const selectedDept = deptDesignations.find(d => Number(d.id) === selectedDeptId);
  const designationsList = selectedDept ? (selectedDept.designations || []) : [];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
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
                'Fill in the user account details to onboard a new user profile.'
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: User Account Details */}
              <div className="flex flex-col gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-150/70">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0 pb-2 border-b border-slate-200 flex items-center gap-1.5">
                  <span>👤</span> User Account Details
                </h4>

                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('first_name') ? 'text-rose-600' : 'text-slate-700'}`}>
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className={`w-full p-2.5 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('first_name')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('first_name')}
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('last_name') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className={`w-full p-2.5 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('last_name')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('last_name')}
                  </div>
                </div>

                {/* Username & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('username') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      required
                      disabled={isEditMode}
                      className={`w-full p-2.5 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${getFieldErrorString('username')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('username')}
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('email') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      required
                      disabled={isEditMode}
                      className={`w-full p-2.5 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${getFieldErrorString('email')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('email')}
                  </div>
                </div>

                {/* Password & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('password') ? 'text-rose-600' : 'text-slate-700'}`}>
                      <span>
                        Password {!isEditMode && <span className="text-rose-500">*</span>}
                      </span>
                      {isEditMode && (
                        <span className="text-[10px] text-slate-400 font-normal ml-1">Keep empty if unchanged</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={isEditMode ? '••••••••' : 'Password123!'}
                        required={!isEditMode}
                        className={`w-full p-2.5 pr-10 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('password')
                          ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                          : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
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
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('phone') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full p-2.5 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('phone')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
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
                      error={getFieldErrorString('role')}
                      placeholder="-- Select User Role --"
                      options={
                        roles.length > 0
                          ? roles.map((r) => ({
                            value: Number(r.id),
                            label: r.name || r.title || r.role_name || r.display_name || `Role #${r.id}`
                          }))
                          : [
                            { value: 1, label: 'Super Admin' },
                            { value: 2, label: 'Admin' },
                            { value: 3, label: 'HR' },
                            { value: 4, label: 'Employee' },
                            { value: 5, label: 'Project Manager' },
                            { value: 6, label: 'Department Manager' }
                          ]
                      }
                    />
                  )}
                </div>

                {/* Is Active Toggle Switch */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mt-2">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">User Account Status</span>
                    <span className="text-[10px] text-slate-500 block">Toggle to activate or deactivate user login access</span>
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
                    <span className="ml-2.5 text-xs font-semibold text-slate-700 min-w-[50px] text-right">
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>

              </div>

              {/* Right Column: Employee details */}
              <div className="flex flex-col gap-4 p-5 bg-indigo-50/10 rounded-2xl border border-indigo-100/50">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider m-0 pb-2 border-b border-indigo-100 flex items-center gap-1.5">
                  <span>🏢</span> Employee Job Details
                </h4>

                {/* Date of Joining & Employment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('employee_details.joining_date') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      name="joining_date"
                      value={formData.joining_date}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-xl bg-white border text-xs text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('employee_details.joining_date')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('employee_details.joining_date')}
                  </div>

                  <CustomSelect
                    label="Employment Type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    error={getFieldErrorString('employee_details.employment_type') || getFieldErrorString('employment_type')}
                    placeholder="Select Type"
                    options={[
                      { value: 'full_time', label: 'Full Time' },
                      { value: 'part_time', label: 'Part Time' },
                      { value: 'contract', label: 'Contract' },
                      { value: 'intern', label: 'Intern' }
                    ]}
                  />
                </div>

                {/* Department & Designation Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSelect
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    error={getFieldErrorString('employee_details.department') || getFieldErrorString('department')}
                    placeholder={fetchingDepts ? "Loading departments..." : "Select Department"}
                    options={deptDesignations.map((dept) => ({
                      value: dept.id,
                      label: `${dept.name} (${dept.code || `#${dept.id}`})`
                    }))}
                  />

                  <CustomSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    error={getFieldErrorString('employee_details.designation') || getFieldErrorString('designation')}
                    placeholder={
                      fetchingDepts
                        ? "Loading designations..."
                        : !formData.department
                          ? "Select Department First"
                          : "Select Designation"
                    }
                    disabled={!formData.department}
                    options={designationsList.map((desg) => ({
                      value: desg.id,
                      label: `${desg.name} (${desg.code || `#${desg.id}`})`
                    }))}
                  />
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('employee_details.date_of_birth') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-xl bg-white border text-xs text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('employee_details.date_of_birth')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('employee_details.date_of_birth')}
                  </div>

                  <CustomSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    error={getFieldErrorString('employee_details.gender') || getFieldErrorString('gender')}
                    placeholder="-- Select Gender --"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>

                {/* Emergency Contact Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('employee_details.emergency_contact_name') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`w-full p-2.5 rounded-xl bg-white border text-xs text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('employee_details.emergency_contact_name')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('employee_details.emergency_contact_name')}
                  </div>

                  <div>
                    <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('employee_details.emergency_contact_phone') ? 'text-rose-600' : 'text-slate-700'}`}>
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className={`w-full p-2.5 rounded-xl bg-white border text-xs text-slate-900 focus:outline-none transition-all duration-200 ${getFieldErrorString('employee_details.emergency_contact_phone')
                        ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                        }`}
                    />
                    {renderFieldError('employee_details.emergency_contact_phone')}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className={`text-xs font-semibold mb-1 block ${getFieldErrorString('employee_details.address') ? 'text-rose-600' : 'text-slate-700'}`}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, New York, NY"
                    rows={2}
                    className={`w-full p-2.5 rounded-xl bg-white border text-xs text-slate-900 focus:outline-none transition-all duration-200 resize-none ${getFieldErrorString('employee_details.address')
                      ? 'border-rose-500 bg-rose-50/10 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/10'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10'
                      }`}
                  />
                  {renderFieldError('employee_details.address')}
                </div>
              </div>
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
                  <span>{isEditMode ? 'Saving Changes...' : 'Onboarding User...'}</span>
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
