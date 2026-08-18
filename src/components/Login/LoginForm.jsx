import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm({ onLoginSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Please enter your email or username.';
      isValid = false;
    } else if (email.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'The email field must be a valid email address.';
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your account password.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email: email.trim(), password }, true);
      setIsLoading(false);

      if (result && result.success) {
        const authenticatedUser = result.user;
        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser);
        } else {
          const roleStr = (authenticatedUser.role_name || authenticatedUser.role || '').toString().toLowerCase();
          if (authenticatedUser.role_id === 5 || roleStr.includes('employee')) {
            navigate('/employee');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setErrorMessage(result?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="p-8 sm:p-12 flex flex-col justify-center bg-white/60 backdrop-blur-md">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Please enter your credentials to sign in. You will be automatically redirected to your role dashboard.</p>
      </div>

      {/* Error Toast Notification */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={`text-xs font-semibold ${errors.email ? 'text-rose-600' : 'text-slate-700'}`}>Work Email or Username</label>
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
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                if (errorMessage) setErrorMessage('');
              }}
              className={`w-full py-3 pl-11 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 ${errors.email
                ? 'border-rose-500 focus:ring-rose-500/20 bg-rose-50/10 pr-10'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20 pr-4'
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-600 mt-0.5">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={`text-xs font-semibold ${errors.password ? 'text-rose-600' : 'text-slate-700'}`}>Password</label>
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
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                if (errorMessage) setErrorMessage('');
              }}
              className={`w-full py-3 pl-11 rounded-xl bg-white/90 border text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 ${errors.password
                ? 'border-rose-500 focus:ring-rose-500/20 bg-rose-50/10 pr-20'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20 pr-11'
                }`}
            />
            <div className="absolute right-3.5 flex items-center gap-2">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 flex items-center cursor-pointer"
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
          {errors.password && (
            <p className="text-xs text-rose-600 mt-0.5">{errors.password}</p>
          )}
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

        <div className="text-center mt-3">
          <span className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Create an Account
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
