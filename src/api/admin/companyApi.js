import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches company profile details by Company ID
 * Endpoint: GET /api/company/{companyId}/
 */
export async function fetchCompanyByIdApi(companyId) {
  try {
    if (!companyId) {
      return { success: false, message: 'Invalid company ID provided' };
    }
    const res = await axiosInstance.get(`/api/company/${companyId}/`);
    if (res.ok && res.data) {
      const data = res.data;
      if (data.success && data.data) {
        return { success: true, company: data.data };
      }
      return { success: true, company: data.data || data };
    }
    return {
      success: false,
      message: res.data?.message || 'Failed to retrieve company profile'
    };
  } catch (error) {
    console.error('Error fetching company details:', error);
    return {
      success: false,
      message: error.message || 'Network error retrieving company profile'
    };
  }
}

/**
 * Updates company profile details
 * Endpoint: PUT /api/company/{companyId}/
 */
export async function updateCompanyApi(companyId, companyData) {
  try {
    const res = await axiosInstance.put(`/api/company/${companyId}/`, companyData);
    if (res.ok && res.data) {
      return {
        success: true,
        data: res.data.data || res.data,
        message: res.data.message || 'Company profile updated successfully'
      };
    }
    return {
      success: false,
      message: res.data?.message || 'Failed to update company profile',
      errors: res.data?.errors || null
    };
  } catch (error) {
    console.error('Error updating company profile:', error);
    return {
      success: false,
      message: error.message || 'Network error updating company profile'
    };
  }
}
