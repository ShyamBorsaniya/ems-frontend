import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompaniesApi, registerUserApi } from '../../api/publicApi';
import CustomSelect from '../common/CustomSelect';

export default function RegisterForm() {
  // Form State
  const [formData, setFormData] = useState({
    company: '',
    department: '',
    designation: '',
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    status: 'inactive',
    role: 2,
    employee_code: ''
  });

  // Dynamic Options State
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // UX & Validation State
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Fetch Companies on component mount
  useEffect(() => {
    let isMounted = true;
    async function loadCompanies() {
      setLoadingCompanies(true);
      const res = await fetchCompaniesApi();
      if (isMounted) {
        if (res.success) {
          setCompanies(res.companies || []);
        } else {
          setErrorMessage(res.message || 'Failed to load company options.');
        }
        setLoadingCompanies(false);
      }
    }
    loadCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derived options based on selections
  const selectedCompanyObj = companies.find((comp) => String(comp.id || comp.value) === String(formData.company));
  const departments = selectedCompanyObj ? (selectedCompanyObj.departments || []) : [];

  const selectedDeptObj = departments.find((dept) => String(dept.id || dept.value) === String(formData.department));
  const designations = selectedDeptObj ? (selectedDeptObj.designations || []) : [];

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };
      if (name === 'company') {
        updated.department = '';
        updated.designation = '';
      } else if (name === 'department') {
        updated.designation = '';
      }
      return updated;
    });

    if (errorMessage) setErrorMessage('');
    
    // Clear errors for modified field and dependent fields
    setFieldErrors((prev) => {
      const updatedErrors = {
        ...prev,
        [name]: null
      };
      if (name === 'company') {
        updatedErrors.department = null;
        updatedErrors.designation = null;
      } else if (name === 'department') {
        updatedErrors.designation = null;
      }
      return updatedErrors;
    });
  };

  // Form Validation & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const newFieldErrors = {};

    if (!formData.company) newFieldErrors.company = ['Please select a company.'];
    if (!formData.department) newFieldErrors.department = ['Please select a department.'];
    if (!formData.designation) newFieldErrors.designation = ['Please select a designation.'];
    if (!formData.username.trim()) newFieldErrors.username = ['Username is required.'];
    if (!formData.email.trim()) newFieldErrors.email = ['Email address is required.'];
    if (!formData.password) newFieldErrors.password = ['Password is required.'];
    if (!formData.first_name.trim()) newFieldErrors.first_name = ['First name is required.'];
    if (!formData.last_name.trim()) newFieldErrors.last_name = ['Last name is required.'];
    if (!formData.employee_code.trim()) newFieldErrors.employee_code = ['Employee code is required.'];

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUserApi(formData);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage(result.message || 'you are registered successfull please wait untill admin can approve');
        // Reset form inputs
        setFormData({
          company: '',
          department: '',
          designation: '',
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          status: 'inactive',
          role: 2,
          employee_code: ''
        });
      } else {
        setErrorMessage(result.message || 'User registration failed');
        if (result.errors && typeof result.errors === 'object') {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('An unexpected error occurred during registration. Please try again.');
    }
  };

  // Field error renderer helper
  const renderFieldError = (fieldName) => {
    const err = fieldErrors[fieldName];
    if (!err) return null;
    const msg = Array.isArray(err) ? err.join(' ') : String(err);
    return (
      <span className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
        <span>⚠️</span>
        <span>{msg}</span>
      </span>
    );
  };

  return (
    <div className="px-6 py-10 sm:px-10 sm:py-12 flex flex-col bg-white/60 backdrop-blur-md max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Please fill in all required fields to register your new account.</p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-start gap-3 mb-5 animate-fadeIn shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 shrink-0 mt-0.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>
            <p className="font-bold text-emerald-900">Registration Successful</p>
            <p className="text-emerald-700 text-xs font-medium mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-start gap-3 mb-5 animate-fadeIn shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-600 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <p className="font-bold text-rose-900">{errorMessage}</p>
            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <p className="text-rose-600 text-xs font-normal mt-0.5">Please check the highlighted errors below.</p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Step 1: Select Company */}
        <div>
          <CustomSelect
            label="Select Company"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={loadingCompanies}
            required
            error={fieldErrors.company}
            placeholder={loadingCompanies ? "Loading companies..." : "-- Choose Organization / Company --"}
            options={companies.map((comp) => ({
              value: comp.id || comp.value,
              label: `${comp.name || comp.company_name || `Company #${comp.id}`}${comp.code ? ` (${comp.code})` : ''}`
            }))}
          />
        </div>

        {/* Step 2: Select Department (Filtered by selected company) */}
        <div>
          <CustomSelect
            label="Select Department"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!formData.company}
            required
            error={fieldErrors.department}
            placeholder={
              !formData.company
                ? "-- Select a Company First --"
                : departments.length === 0
                ? "-- No Departments Found for Selected Company --"
                : "-- Choose Department --"
            }
            options={departments.map((d) => ({
              value: d.id || d.value,
              label: `${d.name || `Department #${d.id}`}${d.code ? ` (${d.code})` : ''}`
            }))}
          />
        </div>

        {/* Step 3: Select Designation (Filtered by selected department) */}
        <div>
          <CustomSelect
            label="Select Designation"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            disabled={!formData.department}
            required
            error={fieldErrors.designation}
            placeholder={
              !formData.department
                ? "-- Select a Department First --"
                : designations.length === 0
                ? "-- No Designations Found for Selected Department --"
                : "-- Choose Designation --"
            }
            options={designations.map((desg) => ({
              value: desg.id || desg.value,
              label: `${desg.name || `Designation #${desg.id}`}${desg.code ? ` (${desg.code})` : ''}`
            }))}
          />
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="first_name" className="text-xs font-semibold text-slate-700 mb-1 block">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
              className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
                fieldErrors.first_name ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
              }`}
            />
            {renderFieldError('first_name')}
          </div>

          <div>
            <label htmlFor="last_name" className="text-xs font-semibold text-slate-700 mb-1 block">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
              className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
                fieldErrors.last_name ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
              }`}
            />
            {renderFieldError('last_name')}
          </div>
        </div>

        {/* Username & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="username" className="text-xs font-semibold text-slate-700 mb-1 block">
              Username <span className="text-rose-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
                fieldErrors.username ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
              }`}
            />
            {renderFieldError('username')}
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-semibold text-slate-700 mb-1 block">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
                fieldErrors.email ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
              }`}
            />
            {renderFieldError('email')}
          </div>
        </div>

        {/* Employee Code */}
        <div>
          <label htmlFor="employee_code" className="text-xs font-semibold text-slate-700 mb-1 block">
            Employee Code <span className="text-rose-500">*</span>
          </label>
          <input
            id="employee_code"
            type="text"
            name="employee_code"
            placeholder="EMP-1234"
            value={formData.employee_code}
            onChange={handleChange}
            required
            className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
              fieldErrors.employee_code ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
            }`}
          />
          {renderFieldError('employee_code')}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-xs font-semibold text-slate-700 mb-1 block">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full py-2.5 px-3.5 pr-11 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all focus:outline-none ${
                fieldErrors.password ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
              }`}
            />
            <button
              type="button"
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 flex items-center cursor-pointer text-xs font-semibold"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {renderFieldError('password')}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>

        <div className="text-center mt-2">
          <span className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
