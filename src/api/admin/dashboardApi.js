import { axiosInstance } from '../../services/axiosInstance';

export async function fetchAdminDashboardStatsApi() {
  const res = await axiosInstance.get('/api/admin/dashboard/stats/');
  return res.data;
}

export async function fetchProjectsApi() {
  const res = await axiosInstance.get('/api/admin/projects/');
  return res.data;
}

export async function fetchRolesApi() {
  const res = await axiosInstance.get('/api/admin/roles/');
  return res.data;
}
