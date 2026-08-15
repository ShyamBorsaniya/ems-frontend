import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches designation list from backend API
 * Endpoint: GET /api/designation/
 * Filters: search, page, is_active, department
 */
export async function fetchDesignationsApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.is_active !== undefined && filters.is_active !== '' && filters.is_active !== 'all') {
      params.append('is_active', filters.is_active);
    }
    if (filters.department && filters.department !== 'all' && filters.department !== 'All') {
      params.append('department', filters.department);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await axiosInstance.get(`/api/designation/${queryString}`);

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve designation list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchDesignationsApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving designation list',
      data: { results: [], pagination: null }
    };
  }
}

/**
 * Creates a new designation
 * Endpoint: POST /api/designation/
 */
export async function createDesignationApi(designationData) {
  const res = await axiosInstance.post('/api/designation/', designationData);
  return res.data;
}

/**
 * Updates an existing designation
 * Endpoint: PUT /api/designation/{{id}}/
 */
export async function updateDesignationApi(designationId, designationData) {
  const res = await axiosInstance.put(`/api/designation/${designationId}/`, designationData);
  return res.data;
}

/**
 * Deletes a designation
 * Endpoint: DELETE /api/designation/{{id}}/
 */
export async function deleteDesignationApi(designationId) {
  const res = await axiosInstance.delete(`/api/designation/${designationId}/`);
  return res.data;
}

/**
 * Fetches a single designation by ID
 * Endpoint: GET /api/designation/{{id}}/
 */
export async function fetchDesignationByIdApi(designationId) {
  try {
    const res = await axiosInstance.get(`/api/designation/${designationId}/`);
    return res.data;
  } catch (error) {
    console.error('Error in fetchDesignationByIdApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Error retrieving designation details',
      data: null
    };
  }
}


