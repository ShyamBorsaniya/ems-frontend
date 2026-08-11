export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  HR: 'HR',
  EMPLOYEE: 'Employee'
};

export const DEFAULT_TABS = {
  OVERVIEW: 'overview',
  USERS: 'user',
  PROJECTS: 'project',
  DEPARTMENTS: 'department',
  ROLES: 'role',
  SETTINGS: 'settings'
};

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};
