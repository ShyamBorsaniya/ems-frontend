import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return <Loader fullScreen={true} message="Authenticating session..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const roleStr = (currentUser.role_name || currentUser.role || '').toString().toLowerCase();
    const hasRole = allowedRoles.some(r => roleStr.includes(r.toLowerCase()));
    if (!hasRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
