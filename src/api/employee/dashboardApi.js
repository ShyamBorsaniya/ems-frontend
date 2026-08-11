import { axiosInstance } from '../../services/axiosInstance';

export async function fetchEmployeeDashboardStatsApi() {
  const res = await axiosInstance.get('/api/employee/dashboard/');
  return res.data;
}

export async function applyLeaveApi(leaveData) {
  const res = await axiosInstance.post('/api/employee/leave/', leaveData);
  return res.data;
}

export async function punchClockApi(punchData) {
  const res = await axiosInstance.post('/api/employee/punch/', punchData);
  return res.data;
}
