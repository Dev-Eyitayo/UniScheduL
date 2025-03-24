import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return localStorage.getItem("access") || sessionStorage.getItem("access");
};

const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
    const response = await axios.post(`${API_BASE_URL}/token/refresh`, { refresh });
    const { access, refresh: newRefresh } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", newRefresh);
    return access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    return null;
  }
};

const authFetch = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const config = {
      method: options.method || "GET",
      url,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      data: options.body ? JSON.parse(options.body) : undefined,
    };

    let response = await axios(config);

    return response.data;
  } catch (error) {
    // If token expired, try refreshing
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        const retryConfig = {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          },
        };

        // Rebuild axios config with the new token
        const retry = {
          method: retryConfig.method || "GET",
          url,
          headers: retryConfig.headers,
          data: retryConfig.body ? JSON.parse(retryConfig.body) : undefined,
        };

        const retryResponse = await axios(retry);
        return retryResponse.data;
      }
    }

    console.error("Error in authFetch:", error);
    throw error; // Let the calling function catch it
  }
};

export default authFetch;
