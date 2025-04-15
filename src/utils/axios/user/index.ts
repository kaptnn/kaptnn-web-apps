import { UserLoginRequest, UserRegisterRequest } from "@/utils/constants/user";
import axiosInstance from "..";

// AUTHENTICATION SERVICES

export async function registerUser(userData: UserRegisterRequest) {
  try {
    const response = await axiosInstance.post("/v1/auth/register", userData);
    return response.data?.result;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

export async function loginUser(credentials: UserLoginRequest) {
  try {
    const response = await axiosInstance.post("/v1/auth/login", credentials);
    return response.data?.result;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}

export async function logoutUser(token: string) {
  try {
    const response = await axiosInstance.post(
      "/v1/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.result;
  } catch (error) {
    console.error("Error logging out:", error);
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axiosInstance.post("/v1/auth/token/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

// USER MANAGEMENT SERVICES

export async function getAllUsers(token: string, filters = {}) {
  try {
    const response = await axiosInstance.get("/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getCurrentUser(token: string) {
  try {
    const response = await axiosInstance.get("/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getUserById(userId: string, token: string) {
  try {
    const response = await axiosInstance.get(`/v1/users/user/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getUserByEmail(userEmail: string, token: string) {
  try {
    const response = await axiosInstance.get(
      `/v1/users/user/email/${userEmail}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function getUserByCompanyId(companyId: string, token: string) {
  try {
    const response = await axiosInstance.get(
      `/v1/users/user/company/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching users by company ID:", error);
    return null;
  }
}
