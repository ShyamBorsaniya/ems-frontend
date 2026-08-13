import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login/Login';
import AdminDashboard from '../pages/Admin/Dashboard';
import EmployeeDashboard from '../pages/Employee/Dashboard';
import Loader from '../components/common/Loader';

export default function AppRoutes() {
  const { currentUser, isLoadingSession, logout, isEmployee } = useAuth();
  const navigate = useNavigate();

  if (isLoadingSession) {
    return <Loader fullScreen={true} message="Loading WorkPulse EMS..." />;
  }

  const handleLoginSuccess = (user) => {
    const roleStr = (user.role_name || user.role || '').toString().toLowerCase();
    const emp = user.role_id === 5 || roleStr.includes('employee');
    if (emp) {
      navigate('/employee');
    } else {
      navigate('/user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const LoginWrapper = () => {
    if (currentUser) {
      return <Navigate to={isEmployee ? "/employee" : "/user"} replace />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} />;
  };

  const AdminWrapper = ({ tab }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <AdminDashboard user={currentUser} onLogout={handleLogout} activeTabFromRoute={tab} />;
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
    return <Navigate to={isEmployee ? "/employee" : "/user"} replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/employee/*" element={<EmployeeWrapper />} />
      <Route path="/overview" element={<AdminWrapper tab="overview" />} />
      <Route path="/user" element={<AdminWrapper tab="user" />} />
      <Route path="/pending-users" element={<AdminWrapper tab="pending-users" />} />
      <Route path="/project" element={<AdminWrapper tab="project" />} />
      <Route path="/department" element={<AdminWrapper tab="department" />} />
      <Route path="/role" element={<AdminWrapper tab="role" />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
