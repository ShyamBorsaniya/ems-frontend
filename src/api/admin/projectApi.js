import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches project list from backend API
 * Endpoint: GET /api/project/
 * Query Filters: search, company, department, status, priority, project_manager, page, page_size
 */
export async function fetchProjectsApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.page_size) {
      params.append('page_size', filters.page_size);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.company) {
      params.append('company', filters.company);
    }
    if (filters.department && filters.department !== 'all') {
      params.append('department', filters.department);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    if (filters.project_manager && filters.project_manager !== 'all') {
      params.append('project_manager', filters.project_manager);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await axiosInstance.get(`/api/project/${queryString}`);

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve project list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchProjectsApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving project list',
      data: { results: [], pagination: null }
    };
  }
}

/**
 * Creates a new project
 * Endpoint: POST /api/project/
 */
export async function createProjectApi(projectData) {
  const res = await axiosInstance.post('/api/project/', projectData);
  return res.data;
}

/**
 * Updates an existing project by ID (Full or Partial)
 * Endpoint: PUT or PATCH /api/project/{projectId}/
 */
export async function updateProjectApi(projectId, projectData, isPartial = false) {
  const method = isPartial ? 'patch' : 'put';
  const res = await axiosInstance[method](`/api/project/${projectId}/`, projectData);
  return res.data;
}

/**
 * Deletes a project by ID
 * Endpoint: DELETE /api/project/{projectId}/
 */
export async function deleteProjectApi(projectId) {
  const res = await axiosInstance.delete(`/api/project/${projectId}/`);
  return res.data;
}

/**
 * Fetches a single project details by ID
 * Endpoint: GET /api/project/{projectId}/
 */
export async function fetchProjectByIdApi(projectId) {
  try {
    const res = await axiosInstance.get(`/api/project/${projectId}/`);
    return res.data;
  } catch (error) {
    console.error(`Error in fetchProjectByIdApi (${projectId}):`, error);
    return null;
  }
}
