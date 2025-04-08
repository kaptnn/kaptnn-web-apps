import axios from "axios";
import packageJson from "../../../package.json";

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

async function refreshToken() {
  if (typeof window === "undefined") {
    throw new Error("Cannot refresh token on the server side");
  }
  const storedRefreshToken = localStorage.getItem("refresh_token");

  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axiosInstance.post("/v1/auth/token/refresh", {
      refresh_token: storedRefreshToken,
    });

    const { access_token, refresh_token } = response.data;

    const now = new Date();
    const accessTokenExp = new Date(now.getTime() + 60 * 60 * 1000);
    const refreshTokenExp = new Date(now.getTime() + 60 * 60 * 1000 * 24 * 7);

    localStorage.setItem("access_token", access_token);
    document.cookie = `access_token=${
      response.data.data.access_token
    }; expires=${accessTokenExp.toUTCString()}; path=/; secure; samesite=strict`;
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
      document.cookie = `refresh_token=${
        response.data.data.refresh_token
      }; expires=${refreshTokenExp.toUTCString()}; path=/; secure; samesite=strict`;
    }
    return access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    version: packageJson.version,
  },
  timeout: 5 * 1000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (!error.response) {
      console.error("Network error: Please check your internet connection");
      return Promise.reject(error);
    }

    if (status === 401) {
      try {
        console.warn("Unauthorized: Attempting to refresh token...");
        const newToken = await refreshToken();

        error.config.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance.request(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed during interceptor:", refreshError);
        return Promise.reject(refreshError);
      }
    } else if (status === 404) {
      console.error("Resource not found (404)");
    } else {
      console.error("An error occurred:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
