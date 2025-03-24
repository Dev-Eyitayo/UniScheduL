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
    // Log the user out in case the refresh token is invalid
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
    // Set Authorization header with the current token
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    let response = await axios(url, options);

    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        options.headers.Authorization = `Bearer ${newToken}`;
        response = await axios(url, options);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error in authFetch:", error);
    return [];
  }
};

export default authFetch;