import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Login/LoginForm';
import RegisterForm from '../../components/Register/RegisterForm';

export default function Auth({ mode, onLoginSuccess }) {
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-slate-200 to-indigo-100 font-sans">
      {/* Background Animated Ambient Mesh Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[500px] h-[500px] bg-indigo-400/60 -top-28 -left-24 animate-floatOrb"></div>
        <div className="absolute rounded-full blur-[90px] opacity-55 w-[550px] h-[550px] bg-purple-400/60 -bottom-36 -right-24 animate-floatOrb [animation-delay:-7s]"></div>
        <div className="absolute rounded-full blur-[90px] opacity-35 w-[400px] h-[400px] bg-sky-400/60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-floatOrb [animation-delay:-12s]"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      {/* Main Glassmorphic Card Container */}
      <div
        className={`relative z-10 w-full max-w-[1020px] grid grid-cols-1 ${
          isLogin ? 'md:grid-cols-[1.1fr_1fr]' : 'md:grid-cols-[1.1fr_1.3fr]'
        } rounded-3xl bg-white/88 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/15 overflow-hidden my-4 animate-cardFadeUp`}
      >
        {/* Left Sidebar - Brand & Value Proposition */}
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
            {isLogin ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
                Enterprise Workforce Platform
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                Join Enterprise Workspace
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-white">
              {isLogin ? (
                <>
                  Empowering <span className="text-indigo-200">Modern Teams</span> Everywhere.
                </>
              ) : (
                <>
                  Create Your <span className="text-indigo-200">User Account</span>
                </>
              )}
            </h1>

            <p className="text-indigo-100 text-sm leading-relaxed">
              {isLogin
                ? 'Manage attendance, payroll, performance, and team collaboration in one unified enterprise portal.'
                : 'Select your organization, choose your role, and complete registration to get started with WorkPulse EMS.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {isLogin ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="text-xs text-indigo-200/80">
            {isLogin ? (
              `© ${new Date().getFullYear()} WorkPulse Systems. Secure 256-bit SSL Encryption.`
            ) : (
              <>
                Already registered?{' '}
                <Link to="/login" className="text-white underline font-bold hover:text-indigo-200 transition-colors">
                  Sign In Here
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Dynamic Form Component */}
        {isLogin ? (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
}
