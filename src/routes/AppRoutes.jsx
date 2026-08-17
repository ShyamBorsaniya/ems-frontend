import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Auth from '../pages/Auth/Auth';
import AdminDashboard from '../pages/Admin/Dashboard';
import EmployeeDashboard from '../pages/Employee/Dashboard';
import Loader from '../components/common/Loader';

export default function AppRoutes() {
  const { currentUser, isLoadingSession, logout, isEmployee, refreshCurrentUserDetails } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (currentUser?.id) {
      refreshCurrentUserDetails(currentUser.id);
    }
  }, [currentUser?.id, refreshCurrentUserDetails]);

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

  const renderLoginRoute = () => {
    if (currentUser) {
      return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
    }
    return <Auth mode="login" onLoginSuccess={handleLoginSuccess} />;
  };

  const renderRegisterRoute = () => {
    if (currentUser) {
      return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
    }
    return <Auth mode="register" />;
  };

  const renderAdminRoute = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    if (isEmployee) {
      const path = location.pathname.replace('/', '').toLowerCase();
      if (path === 'user' || path === 'users') {
        return <Navigate to="/employee/user" replace />;
      }
      if (path === 'project' || path === 'projects') {
        return <Navigate to="/employee/project" replace />;
      }
      return <Navigate to="/employee" replace />;
    }
    const path = location.pathname.replace('/', '').toLowerCase();
    const validTabs = ['dashboard', 'user', 'pending-users', 'project', 'department', 'designation', 'company', 'profile', 'my-profile'];
    if (!validTabs.includes(path)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  };

  const renderEmployeeRoute = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
  };

  const renderRootRedirect = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to={isEmployee ? "/employee" : "/dashboard"} replace />;
  };

  return (
    <Routes>
      <Route path="/" element={renderRootRedirect()} />
      <Route path="/login" element={renderLoginRoute()} />
      <Route path="/register" element={renderRegisterRoute()} />
      <Route path="/employee/*" element={renderEmployeeRoute()} />
      <Route path="/:tab" element={renderAdminRoute()} />
      <Route path="*" element={renderRootRedirect()} />
    </Routes>
  );
}

