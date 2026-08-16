import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Auth from '../pages/Auth/Auth';
import AdminDashboard from '../pages/Admin/Dashboard';
import EmployeeDashboard from '../pages/Employee/Dashboard';
import Loader from '../components/common/Loader';

export default function AppRoutes() {
  const { currentUser, isLoadingSession, logout, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoadingSession) {
    return <Loader fullScreen={true} message="Loading WorkPulse EMS..." />;
  }

  const handleLoginSuccess = (user) => {
    const roleStr = (user.role_name || user.role || '').toString().toLowerCase();
    const emp = user.role_id === 5 || roleStr.includes('employee');
    if (emp) {
      navigate('/employee');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const LoginWrapper = () => {
    if (currentUser) {
      return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
    }
    return <Auth mode="login" onLoginSuccess={handleLoginSuccess} />;
  };

  const RegisterWrapper = () => {
    if (currentUser) {
      return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
    }
    return <Auth mode="register" />;
  };

  const AdminWrapper = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    const path = location.pathname.replace('/', '').toLowerCase();
    const validTabs = ['dashboard', 'user', 'pending-users', 'project', 'department', 'designation'];
    if (!validTabs.includes(path)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  };

  const EmployeeWrapper = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
  };

  const RootRedirect = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/register" element={<RegisterWrapper />} />
      <Route path="/employee/*" element={<EmployeeWrapper />} />
      <Route path="/:tab" element={<AdminWrapper />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

