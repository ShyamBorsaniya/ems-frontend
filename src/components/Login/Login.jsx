import React, { useState } from 'react';
import './Login.css';
import ForgotPasswordModal from './ForgotPasswordModal';
import { loginApi } from '../../services/api';
import { saveAuthData } from '../../utils/storage';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('employee'); // 'employee' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Form Validation
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
        // Save response data in browser storage (localStorage / sessionStorage)
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
    <div className="login-container">
      {/* Background Animated Ambient Mesh Orbs */}
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* Main Glassmorphic Login Card */}
      <div className="login-card-wrapper">
        {/* Left Sidebar - Brand & Value Proposition */}
        <div className="brand-sidebar">
          <div className="brand-header">
            <div className="brand-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="brand-title">WorkPulse EMS</span>
          </div>

          <div className="brand-hero-content">
            <div className="brand-badge">
              <span className="brand-badge-dot"></span>
              Enterprise Workforce Platform
            </div>
            <h1 className="brand-hero-title">
              Empowering <span>Modern Teams</span> Everywhere.
            </h1>
            <p className="brand-hero-desc">
              Manage attendance, payroll, performance, and team collaboration in one unified enterprise portal.
            </p>
          </div>

          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Real-time Attendance & Leave Management</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Automated Payroll & Benefits Analytics</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Role-Based Secure Access Controls</span>
            </div>
          </div>

          <div className="brand-footer-text">
            © 2026 WorkPulse Systems. Secure 256-bit SSL Encryption.
          </div>
        </div>

        {/* Right Area - Login Form */}
        <div className="login-form-area">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access your account dashboard.</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${role === 'employee' ? 'active' : ''}`}
              onClick={() => handleRoleChange('employee')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Employee Portal
            </button>

            <button
              type="button"
              className={`role-tab ${role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Admin / HR / Manager
            </button>
          </div>

          {/* Error Toast Notification */}
          {errorMessage && (
            <div className="toast-message toast-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">
                {role === 'employee' ? 'Work Email or Employee ID' : 'Admin Work Email'}
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="email"
                  type="text"
                  placeholder={role === 'employee' ? 'alex.morgan@company.com' : 'sarah.admin@company.com'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={errorMessage ? 'has-error' : ''}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  className={errorMessage ? 'has-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
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

            {/* Remember Me & Forgot Password Utility */}
            <div className="form-utility">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setIsModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
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

      {/* Forgot Password Reset Modal */}
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
