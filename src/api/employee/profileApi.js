import { axiosInstance } from '../../services/axiosInstance';

export async function fetchEmployeeProfileApi() {
  const res = await axiosInstance.get('/api/employee/profile/');
  return res.data;
}

export async function updateEmployeeProfileApi(profileData) {
  const res = await axiosInstance.put('/api/employee/profile/', profileData);
  return res.data;
}
