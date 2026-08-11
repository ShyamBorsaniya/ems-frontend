import React, { useState } from 'react';
import { loginApi } from '../../services/api';
import { saveAuthData } from '../../utils/storage';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi({ email: email.trim(), password });

      setIsLoading(false);

      if (response && response.success === true && response.data) {
        saveAuthData(response, rememberMe);

        const userData = response.data.user || {};
        const tokens = response.data.tokens || {};

        const authenticatedUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          name: [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.username || 'User',
          role: userData.role_name || (userData.role === 5 ? 'Employee' : 'User'),
          role_name: userData.role_name,
          role_id: userData.role,
          employeeId: `EMP-${userData.id || '1'}`,
          phone: userData.phone,
          profile_image: userData.profile_image,
          is_active: userData.is_active,
          created_at: userData.created_at,
          tokens: tokens,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser);
        }
      } else {
        setErrorMessage(response?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-slate-200 to-indigo-100 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[500px] h-[500px] bg-indigo-400/60 -top-28 -left-24 animate-floatOrb"></div>
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[550px] h-[550px] bg-purple-400/60 -bottom-36 -right-24 animate-floatOrb [animation-delay:-7s]"></div>
        <div className="absolute rounded-full blur-[90px] opacity-35 w-[400px] h-[400px] bg-sky-400/60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-floatOrb [animation-delay:-12s]"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1020px] grid grid-cols-1 md:grid-cols-[1.1fr_1fr] rounded-3xl bg-white/88 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/15 overflow-hidden animate-cardFadeUp">
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
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
              Enterprise Workforce Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-white">
              Empowering <span className="text-indigo-200">Modern Teams</span> Everywhere.
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Manage attendance, payroll, performance, and team collaboration in one unified enterprise portal.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Real-time Attendance & Leave Management</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Automated Payroll & Benefits Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-indigo-100 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</div>
              <span>Automatic Role-Based Dashboard Access</span>
            </div>
          </div>

          <div className="text-xs text-indigo-200/80">
            © {new Date().getFullYear()} WorkPulse Systems. Secure 256-bit SSL Encryption.
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white/60 backdrop-blur-md">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Please enter your credentials to sign in. You will be automatically redirected to your role dashboard.</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">Work Email or Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="email"
                  type="text"
                  placeholder="name@company.com or username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`w-full py-3 pl-11 pr-4 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errorMessage ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`w-full py-3 pl-11 pr-11 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errorMessage ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
