import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompaniesApi, fetchRolesByCompanyApi, registerUserApi } from '../../api/publicApi';

export default function Register() {

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    status: 'pending'
  });

  // Dynamic Options State
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);

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

  // 2. Fetch Roles whenever selected company changes
  useEffect(() => {
    let isMounted = true;
    async function loadRoles() {
      if (!formData.company) {
        setRoles([]);
        setFormData((prev) => ({ ...prev, role: '' }));
        return;
      }

      setLoadingRoles(true);
      const res = await fetchRolesByCompanyApi(formData.company);
      if (isMounted) {
        if (res.success) {
          setRoles(res.roles || []);
          // Auto-select first role if available and current selected role is invalid
          if (res.roles.length > 0) {
            setFormData((prev) => ({ ...prev, role: res.roles[0].id || res.roles[0].value || '' }));
          } else {
            setFormData((prev) => ({ ...prev, role: '' }));
          }
        } else {
          setRoles([]);
          setFormData((prev) => ({ ...prev, role: '' }));
        }
        setLoadingRoles(false);
      }
    }

    loadRoles();
    return () => {
      isMounted = false;
    };
  }, [formData.company]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errorMessage) setErrorMessage('');
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Form Validation & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const newFieldErrors = {};

    if (!formData.company) newFieldErrors.company = ['Please select a company.'];
    if (!formData.role) newFieldErrors.role = ['Please select a role.'];
    if (!formData.username.trim()) newFieldErrors.username = ['Username is required.'];
    if (!formData.email.trim()) newFieldErrors.email = ['Email address is required.'];
    if (!formData.password) newFieldErrors.password = ['Password is required.'];
    if (!formData.first_name.trim()) newFieldErrors.first_name = ['First name is required.'];
    if (!formData.last_name.trim()) newFieldErrors.last_name = ['Last name is required.'];

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
          role: '',
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          status: 'pending'
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-slate-200 to-indigo-100 font-sans">
      {/* Animated Ambient Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[500px] h-[500px] bg-indigo-400/60 -top-28 -left-24 animate-floatOrb"></div>
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[550px] h-[550px] bg-purple-400/60 -bottom-36 -right-24 animate-floatOrb [animation-delay:-7s]"></div>
        <div className="absolute rounded-full blur-[90px] opacity-35 w-[400px] h-[400px] bg-sky-400/60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-floatOrb [animation-delay:-12s]"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[1020px] grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] rounded-3xl bg-white/88 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/15 overflow-hidden my-4 animate-cardFadeUp">
        {/* Left Side: Branding Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-700 p-8 sm:p-12 flex flex-col justify-between border-r border-white/15 relative overflow-hidden text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">WorkPulse EMS</span>
          </div>

          <div className="my-8 sm:my-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              Join Enterprise Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-white">
              Create Your <span className="text-indigo-200">User Account</span>
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Select your organization, choose your role, and complete registration to get started with WorkPulse EMS.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Multi-Company Workspace Access</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Role-Based Granular Permissions</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Instant Approval Workflow</span>
            </div>
          </div>

          <div className="text-xs text-indigo-200/80">
            Already registered?{' '}
            <Link to="/login" className="text-white underline font-bold hover:text-indigo-200 transition-colors">
              Sign In Here
            </Link>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-white/60 backdrop-blur-md">
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
              <label htmlFor="company" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Select Company <span className="text-rose-500">*</span></span>
                {loadingCompanies && <span className="text-[10px] text-indigo-600 font-semibold animate-pulse">Loading companies...</span>}
              </label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={loadingCompanies}
                required
                className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 focus:outline-none transition-all cursor-pointer ${
                  fieldErrors.company ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                }`}
              >
                <option value="">-- Choose Organization / Company --</option>
                {companies.map((comp) => (
                  <option key={comp.id || comp.value} value={comp.id || comp.value}>
                    {comp.name || comp.company_name || `Company #${comp.id}`} {comp.code ? `(${comp.code})` : ''}
                  </option>
                ))}
              </select>
              {renderFieldError('company')}
            </div>

            {/* Step 2: Select Role (Filtered by selected company) */}
            <div>
              <label htmlFor="role" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Select Role <span className="text-rose-500">*</span></span>
                {loadingRoles && <span className="text-[10px] text-indigo-600 font-semibold animate-pulse">Loading roles...</span>}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!formData.company || loadingRoles}
                required
                className={`w-full py-2.5 px-3.5 rounded-xl bg-white/90 border text-sm text-slate-900 focus:outline-none transition-all cursor-pointer ${
                  !formData.company ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : fieldErrors.role ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20'
                }`}
              >
                {!formData.company ? (
                  <option value="">-- Select a Company First --</option>
                ) : roles.length === 0 ? (
                  <option value="">-- No Roles Found for Selected Company --</option>
                ) : (
                  <>
                    <option value="">-- Choose Role --</option>
                    {roles.map((r) => (
                      <option key={r.id || r.value} value={r.id || r.value}>
                        {r.name || r.role_name || r.title || `Role #${r.id}`}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {renderFieldError('role')}
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
      </div>
    </div>
  );
}
