import axios from "axios";
import { apiUrl } from "./api";

// =======================
// Axios instance for cookie-based auth
// =======================
const authApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ✅ สำคัญมากสำหรับ cookie auth
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// =======================
// Types
// =======================
export type LoginInput = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

export type LoginResponse = {
  message: string;
  user: LoginUser;
};

export type MeResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: string;
  phone_number: string;
  location: string;
  position: string;
  role: string;
};

export type LogoutResponse = {
  message: string;
};

// =======================
// API: POST /auth/login
// =======================
export const Login = async (
  payload: LoginInput
): Promise<LoginResponse | null> => {
  try {
    const response = await authApi.post("/auth/login", payload);

    console.log("Login raw response:", response.data);

    if (response.data && response.data.user) {
      return response.data as LoginResponse;
    }

    console.error("Unexpected login response:", response.data);
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

// =======================
// API: GET /auth/me
// =======================
export const GetMe = async (): Promise<MeResponse | null> => {
  try {
    const response = await authApi.get("/auth/me");

    console.log("GetMe raw response:", response.data);

    if (response.data && typeof response.data === "object") {
      return response.data as MeResponse;
    }

    console.error("Unexpected GetMe response:", response.data);
    return null;
  } catch (error) {
    console.error("GetMe error:", error);
    return null;
  }
};

// =======================
// API: POST /auth/logout
// =======================
export const Logout = async (): Promise<LogoutResponse | null> => {
  try {
    const response = await authApi.post("/auth/logout");

    console.log("Logout raw response:", response.data);

    if (response.data && response.data.message) {
      return response.data as LogoutResponse;
    }

    console.error("Unexpected logout response:", response.data);
    return null;
  } catch (error) {
    console.error("Logout error:", error);
    return null;
  }
};

export default authApi;