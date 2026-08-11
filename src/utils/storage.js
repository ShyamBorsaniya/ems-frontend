const ACCESS_TOKEN_KEY = 'ems_access_token';
const REFRESH_TOKEN_KEY = 'ems_refresh_token';
const USER_KEY = 'ems_user_data';
const AUTH_DATA_KEY = 'ems_auth_response';

/**
 * Saves login response data in storage (localStorage or sessionStorage)
 */
export function saveAuthData(responseData, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;

  // Clear previous data in both storages to ensure clean state
  clearAuthData();

  if (!responseData) return;

  const data = responseData.data || responseData;
  const tokens = data.tokens || {};
  const user = data.user || {};

  if (tokens.access) {
    storage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  }
  if (tokens.refresh) {
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  }

  storage.setItem(USER_KEY, JSON.stringify(user));
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
  const authDataStr = getFromStorage(AUTH_DATA_KEY);

  if (!accessToken && !userStr) {
    return null;
  }

  let user = null;
  let authData = null;

  try {
    if (userStr) user = JSON.parse(userStr);
    if (authDataStr) authData = JSON.parse(authDataStr);
  } catch (e) {
    console.error('Error parsing stored user data:', e);
  }

  return {
    accessToken,
    refreshToken,
    user,
    authData
  };
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
 * Clears all authentication tokens and cached user data from storage
 */
export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_DATA_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(AUTH_DATA_KEY);
}

