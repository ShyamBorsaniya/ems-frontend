import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { getAuthData, clearAuthData } from './utils/storage';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const navigate = useNavigate();

  // Restore authenticated session from storage on app load
  useEffect(() => {
    const storedAuth = getAuthData();
    if (storedAuth && storedAuth.user) {
      const userData = storedAuth.user;
      const tokens = {
        access: storedAuth.accessToken,
        refresh: storedAuth.refreshToken
      };

      const restoredUser = {
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

      setCurrentUser(restoredUser);
    }
    setIsLoadingSession(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (isEmployeeUser(user)) {
      navigate('/employee');
    } else {
      navigate('/user');
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setCurrentUser(null);
    navigate('/login');
  };

  // Helper to determine if user should be redirected to Employee Dashboard or Admin/Manager/Other Dashboard
  const isEmployeeUser = (user) => {
    if (!user) return true;

    // Check role string / role_id from backend response
    const roleStr = (user.role_name || user.role || '').toString().toLowerCase();

    // If role contains admin, manager, hr, director, executive, supervisor, or user/other roles -> Admin & Management Dashboard
    if (
      roleStr.includes('admin') ||
      roleStr.includes('manager') ||
      roleStr.includes('hr') ||
      roleStr.includes('director') ||
      roleStr.includes('executive') ||
      roleStr.includes('supervisor')
    ) {
      return false;
    }

    if (user.role_id === 5 || roleStr.includes('employee')) {
      return true;
    }

    // Default: route non-employee roles to Admin/Management Dashboard
    return false;
  };

  if (isLoadingSession) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc',
        color: '#475569',
        fontFamily: 'sans-serif'
      }}>
        <div>Loading WorkPulse EMS...</div>
      </div>
    );
  }

  // Helper component for Admin Routes
  const AdminRouteWrapper = ({ defaultTab }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <AdminDashboard user={currentUser} onLogout={handleLogout} activeTabFromRoute={defaultTab} />;
  };

  // Helper component for Employee Route
  const EmployeeRouteWrapper = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
  };

  // Helper component for Login Route
  const LoginRouteWrapper = () => {
    if (currentUser) {
      if (isEmployeeUser(currentUser)) {
        return <Navigate to="/employee" replace />;
      } else {
        return <Navigate to="/user" replace />;
      }
    }
    return <Login onLoginSuccess={handleLoginSuccess} />;
  };

  // Helper component for Root Route /
  const RootRedirect = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    if (isEmployeeUser(currentUser)) {
      return <Navigate to="/employee" replace />;
    }
    return <Navigate to="/user" replace />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginRouteWrapper />} />
        <Route path="/employee" element={<EmployeeRouteWrapper />} />
        <Route path="/overview" element={<AdminRouteWrapper defaultTab="overview" />} />
        <Route path="/user" element={<AdminRouteWrapper defaultTab="user" />} />
        <Route path="/project" element={<AdminRouteWrapper defaultTab="project" />} />
        <Route path="/department" element={<AdminRouteWrapper defaultTab="department" />} />
        <Route path="/role" element={<AdminRouteWrapper defaultTab="role" />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
