import React, { useState } from 'react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [resetEmail, setResetEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setResetEmail('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn" onClick={handleClose}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-cardFadeUp relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" onClick={handleClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Enter your registered work email and we will send you instructions to reset your EMS account password.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-email" className={`text-xs font-semibold ${error ? 'text-rose-600' : 'text-slate-700'}`}>Work Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="name@company.com"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  className={`w-full py-2.5 pl-10 pr-3.5 rounded-xl bg-white border text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-rose-500 bg-rose-50/10 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                  }`}
                />
              </div>
              {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button type="button" className="px-4 py-2 rounded-xl text-slate-600 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center flex flex-col items-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Check Your Inbox</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              We've dispatched a password reset link to <strong className="text-slate-800">{resetEmail}</strong>. Please check your email inbox and follow the instructions.
            </p>
            <button className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors" onClick={handleClose}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
