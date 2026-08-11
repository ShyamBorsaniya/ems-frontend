import { axiosInstance } from '../../services/axiosInstance';

export async function fetchUsersApi() {
  const res = await axiosInstance.get('/api/admin/users/');
  return res.data;
}

export async function createUserApi(userData) {
  const res = await axiosInstance.post('/api/admin/users/', userData);
  return res.data;
}

export async function updateUserApi(userId, userData) {
  const res = await axiosInstance.put(`/api/admin/users/${userId}/`, userData);
  return res.data;
}

export async function deleteUserApi(userId) {
  const res = await axiosInstance.delete(`/api/admin/users/${userId}/`);
  return res.data;
}
