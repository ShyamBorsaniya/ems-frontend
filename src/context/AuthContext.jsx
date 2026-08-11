import React, { createContext, useState, useEffect } from 'react';
import { getAuthData, clearAuthData, saveAuthData } from '../utils/storage';
import { loginApi } from '../api/authApi';
import { isEmployeeUser } from '../utils/helpers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore user session from storage on app load
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

  // Listen for automatic logout events triggered by unhandled unauthorized requests / failed token refresh
  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);


  const login = async (credentials, rememberMe = true) => {
    const response = await loginApi(credentials);
    if (response && response.success === true && response.data) {
      saveAuthData(response, rememberMe);
      const userData = response.data.user || {};
      const tokens = response.data.tokens || {};

      const userObj = {
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

      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }
    return response;
  };

  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoadingSession,
    login,
    logout,
    isEmployee: isEmployeeUser(currentUser)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
