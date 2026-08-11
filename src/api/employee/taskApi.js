import { axiosInstance } from '../../services/axiosInstance';

export async function fetchTasksApi() {
  const res = await axiosInstance.get('/api/employee/tasks/');
  return res.data;
}

export async function updateTaskStatusApi(taskId, status) {
  const res = await axiosInstance.put(`/api/employee/tasks/${taskId}/`, { status });
  return res.data;
}
