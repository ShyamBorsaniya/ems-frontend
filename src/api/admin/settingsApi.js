import { axiosInstance } from '../../services/axiosInstance';

export async function fetchSystemSettingsApi() {
  const res = await axiosInstance.get('/api/admin/settings/');
  return res.data;
}

export async function updateSystemSettingsApi(settingsData) {
  const res = await axiosInstance.put('/api/admin/settings/', settingsData);
  return res.data;
}
