const API_BASE = "http://127.0.0.1:8000";

export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");
  let refresh = localStorage.getItem("refresh");

  // Set up headers
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  // Check for expired token
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json();

    if (errorData.code === "token_not_valid" && refresh) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });

        if (!refreshResponse.ok) throw new Error("Refresh token failed");

        const refreshData = await refreshResponse.json();
        localStorage.setItem("access", refreshData.access);

        // Retry original request with new token
        options.headers.Authorization = `Bearer ${refreshData.access}`;
        response = await fetch(url, options);
      } catch (err) {
        console.error("Token refresh failed", err);
        throw err;
      }
    } else {
      console.warn("Token invalid or expired");
    }
  }

  if (!response.ok) {
    const text = await response.text();
    console.error("AuthFetch Error:", response.status, text);
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json(); // return parsed data
}
