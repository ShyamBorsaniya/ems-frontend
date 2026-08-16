import React, { createContext, useState, useEffect } from 'react';
import { getAuthData, clearAuthData, saveAuthData, getCompanyData, getCompanyId } from '../utils/storage';
import { loginApi } from '../api/authApi';
import { isEmployeeUser } from '../utils/helpers';

export const AuthContext = createContext(null);

// Helper to extract a flat array of permission codes
const extractPermissionCodes = (permissionsArray) => {
  if (!Array.isArray(permissionsArray)) return [];
  const codes = [];
  permissionsArray.forEach(item => {
    if (typeof item === 'string') {
      codes.push(item);
    } else if (item && typeof item === 'object') {
      if (Array.isArray(item.permissions)) {
        item.permissions.forEach(perm => {
          if (perm && perm.code) {
            codes.push(perm.code);
          } else if (typeof perm === 'string') {
            codes.push(perm);
          }
        });
      } else if (item.code) {
        codes.push(item.code);
      }
    }
  });
  return codes;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore user session from storage on app load
  useEffect(() => {
    const storedAuth = getAuthData();
    if (storedAuth && storedAuth.user) {
      const userData = storedAuth.user;
      const companyData = storedAuth.company || (typeof userData.company === 'object' ? userData.company : null);
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
        company: companyData,
        company_id: companyData?.id || (typeof userData.company === 'number' ? userData.company : null),
        company_name: companyData?.name || '',
        is_active: userData.is_active,
        created_at: userData.created_at,
        tokens: tokens,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        permissions: userData.permissions || [],
        permissionCodes: extractPermissionCodes(userData.permissions)
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
      const companyData = userData.company || response.data.company || getCompanyData();

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
        company: companyData,
        company_id: companyData?.id || (typeof userData.company === 'number' ? userData.company : null),
        company_name: companyData?.name || '',
        is_active: userData.is_active,
        created_at: userData.created_at,
        tokens: tokens,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        permissions: userData.permissions || [],
        permissionCodes: extractPermissionCodes(userData.permissions)
      };

      setCurrentUser(userObj);
      return { success: true, user: userObj, company: companyData };
    }
    return response;
  };

  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
  };

  const hasPermission = (permission, requireAll = false) => {
    if (!currentUser) return false;

    // Admins/Super Admins get all access by default
    const roleStr = (currentUser.role_name || currentUser.role || '').toString().toLowerCase();
    if (roleStr.includes('admin') || roleStr.includes('super')) {
      return true;
    }

    if (!currentUser.permissionCodes) return false;

    if (Array.isArray(permission)) {
      if (requireAll) {
        return permission.every(p => currentUser.permissionCodes.includes(p));
      }
      return permission.some(p => currentUser.permissionCodes.includes(p));
    }
    return currentUser.permissionCodes.includes(permission);
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoadingSession,
    company: currentUser?.company || getCompanyData(),
    companyId: currentUser?.company_id || getCompanyId(),
    companyName: currentUser?.company_name || getCompanyData()?.name || '',
    login,
    logout,
    isEmployee: isEmployeeUser(currentUser),
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
