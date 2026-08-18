import { axiosInstance } from '../services/axiosInstance';
import { parseApiErrorMessage } from '../utils/helpers';

/**
 * Fetches company list for registration dropdown
 * Endpoint: GET /api/public/companies/
 */
export async function fetchCompaniesApi() {
  try {
    const res = await axiosInstance.get('/api/public/companies/');

    if (res.ok && res.data) {
      let list = [];
      if (Array.isArray(res.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data?.results)) {
        list = res.data.results;
      } else if (Array.isArray(res.data?.data?.results)) {
        list = res.data.data.results;
      }

      return {
        success: true,
        companies: list
      };
    }

    return {
      success: false,
      message: res.data?.message || 'Failed to retrieve company list',
      companies: []
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return {
      success: false,
      message: error.message || 'Network error fetching companies',
      companies: []
    };
  }
}

/**
 * Fetches roles filtered by company ID
 * Endpoint: GET /api/role/?company={companyId}
 */
export async function fetchRolesByCompanyApi(companyId) {
  if (!companyId) {
    return { success: true, roles: [] };
  }

  try {
    const res = await axiosInstance.get(`/api/role/?company=${companyId}`);

    if (res.ok && res.data) {
      let list = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data?.results)) {
        list = res.data.results;
      } else if (Array.isArray(res.data?.data?.results)) {
        list = res.data.data.results;
      } else if (Array.isArray(res.data?.data)) {
        list = res.data.data;
      }

      return {
        success: true,
        roles: list
      };
    }

    return {
      success: false,
      message: res.data?.message || 'Failed to retrieve role list',
      roles: []
    };
  } catch (error) {
    console.error('Error fetching roles for company:', error);
    return {
      success: false,
      message: error.message || 'Network error fetching roles',
      roles: []
    };
  }
}

/**
 * Registers a new user
 * Endpoint: POST /api/user/register/ (Fallback: POST /api/user/)
 */
export async function registerUserApi(userData) {
  const payload = {
    username: userData.username.trim(),
    email: userData.email.trim(),
    first_name: userData.first_name.trim(),
    last_name: userData.last_name.trim(),
    phone: userData.phone ? userData.phone.trim() : "",
    company: Number(userData.company),
    role: Number(userData.role) || 2,
    is_active: userData.is_active !== undefined ? userData.is_active : false,
    department: userData.department ? Number(userData.department) : null,
    designation: userData.designation ? Number(userData.designation) : null,
    employee_details: {
      department: userData.department ? Number(userData.department) : null,
      designation: userData.designation ? Number(userData.designation) : null
    },
    password: userData.password,
    status: userData.status || 'inactive'
  };

  try {
    // Primary endpoint: /api/user/register/
    let res = await axiosInstance.post('/api/user/register/', payload);

    // Fallback if endpoint is /api/user/
    if (!res.ok && (res.status === 404 || res.status === 405)) {
      res = await axiosInstance.post('/api/user/', payload);
    }

    const data = res.data;

    // Handle failure (e.g. status 400, success: false)
    if (!res.ok || (data && data.success === false)) {
      const parsedMsg = parseApiErrorMessage(data, 'User registration failed');
      return {
        success: false,
        message: data?.message || parsedMsg,
        errors: data?.errors || null,
        status_code: data?.status_code || res.status
      };
    }

    // Handle success (e.g. status 201, success: true)
    return {
      success: true,
      message: data?.message || 'you are registered successfull please wait untill admin can approve',
      status_code: data?.status_code || res.status,
      data: data?.data || data
    };
  } catch (error) {
    console.error('Registration Error:', error);
    return {
      success: false,
      message: error.message || 'Unable to submit registration. Please try again.',
      isNetworkError: true
    };
  }
}
