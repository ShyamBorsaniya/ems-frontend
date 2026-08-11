const ACCESS_TOKEN_KEY = 'ems_access_token';
const REFRESH_TOKEN_KEY = 'ems_refresh_token';
const USER_KEY = 'ems_user_data';
const COMPANY_KEY = 'ems_company_data';
const AUTH_DATA_KEY = 'ems_auth_response';

/**
 * Saves login response data (tokens, user, company) in storage (localStorage or sessionStorage)
 */
export function saveAuthData(responseData, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;

  // Clear previous data in both storages to ensure clean state
  clearAuthData();

  if (!responseData) return;

  const data = responseData.data || responseData;
  const tokens = data.tokens || {};
  const user = data.user || {};
  const company = user.company || data.company || null;

  if (tokens.access) {
    storage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  }
  if (tokens.refresh) {
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  }

  storage.setItem(USER_KEY, JSON.stringify(user));

  if (company) {
    const companyObj = typeof company === 'object' ? company : { id: company };
    storage.setItem(COMPANY_KEY, JSON.stringify(companyObj));
  }

  storage.setItem(AUTH_DATA_KEY, JSON.stringify(data));
}

/**
 * Gets currently saved authentication data from storage
 */
export function getAuthData() {
  const getFromStorage = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

  const accessToken = getFromStorage(ACCESS_TOKEN_KEY);
  const refreshToken = getFromStorage(REFRESH_TOKEN_KEY);
  const userStr = getFromStorage(USER_KEY);
  const companyStr = getFromStorage(COMPANY_KEY);
  const authDataStr = getFromStorage(AUTH_DATA_KEY);

  if (!accessToken && !userStr) {
    return null;
  }

  let user = null;
  let company = null;
  let authData = null;

  try {
    if (userStr) user = JSON.parse(userStr);
    if (companyStr) company = JSON.parse(companyStr);
    if (authDataStr) authData = JSON.parse(authDataStr);
  } catch (e) {
    console.error('Error parsing stored auth data:', e);
  }

  if (!company && user && user.company) {
    company = typeof user.company === 'object' ? user.company : { id: user.company };
  }

  return {
    accessToken,
    refreshToken,
    user,
    company,
    authData
  };
}

/**
 * Common helper to retrieve cached company data object
 */
export function getCompanyData() {
  const getFromStorage = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
  const companyStr = getFromStorage(COMPANY_KEY);
  if (companyStr) {
    try {
      return JSON.parse(companyStr);
    } catch (e) {
      console.error('Error parsing stored company data:', e);
    }
  }

  const userStr = getFromStorage(USER_KEY);
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.company) {
        return typeof user.company === 'object' ? user.company : { id: user.company };
      }
    } catch (e) {
      console.error('Error parsing stored user company data:', e);
    }
  }
  return null;
}

/**
 * Common helper to retrieve cached company ID
 */
export function getCompanyId() {
  const company = getCompanyData();
  if (!company) return null;
  return typeof company === 'object' ? company.id : company;
}

/**
 * Updates stored access token (and optional refresh token) in active storage
 */
export function updateTokens(newTokens) {
  if (!newTokens) return;

  const access = newTokens.access || newTokens.accessToken || newTokens.access_token;
  const refresh = newTokens.refresh || newTokens.refreshToken || newTokens.refresh_token;

  const isLocal = !!localStorage.getItem(ACCESS_TOKEN_KEY);
  const isSession = !!sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const storage = isLocal ? localStorage : (isSession ? sessionStorage : localStorage);

  if (access) {
    storage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    storage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  const authDataStr = storage.getItem(AUTH_DATA_KEY);
  if (authDataStr) {
    try {
      const parsed = JSON.parse(authDataStr);
      if (parsed.tokens) {
        if (access) parsed.tokens.access = access;
        if (refresh) parsed.tokens.refresh = refresh;
      } else if (parsed.data && parsed.data.tokens) {
        if (access) parsed.data.tokens.access = access;
        if (refresh) parsed.data.tokens.refresh = refresh;
      } else {
        if (access) parsed.access = access;
        if (refresh) parsed.refresh = refresh;
      }
      storage.setItem(AUTH_DATA_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Error updating cached auth data:', e);
    }
  }
}

/**
 * Clears all authentication tokens, user data, and cached company details from storage
 */
export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(COMPANY_KEY);
  localStorage.removeItem(AUTH_DATA_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(COMPANY_KEY);
  sessionStorage.removeItem(AUTH_DATA_KEY);
}


