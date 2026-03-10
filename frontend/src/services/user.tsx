import axios from "axios";
import { apiUrl } from "./api";

// =======================
// Axios instance for cookie-based auth
// =======================
const userApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ✅ สำคัญมาก
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// =======================
// Types
// =======================
export type UserResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: string;
  phone_number: string;
  location: string;
  position: string;
  role: string;
  message?: string;
  error?: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile: string;
  phone_number: string;
  location: string;
  position: string;
  app_role_id: number;
};

export type UpdateUserInput = {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  profile?: string;
  phone_number?: string;
  location?: string;
  position?: string;
  app_role_id?: number;
};

export type DeleteUserResponse = {
  message: string;
};

// =======================
// API: GET /users
// =======================
export const ListUser = async (): Promise<UserResponse[] | null> => {
  try {
    const response = await userApi.get("/users");

    console.log("ListUser raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as UserResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as UserResponse[];
    }

    console.error("Expected array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListUser error:", error);
    return null;
  }
};

// =======================
// API: GET /users/:id
// =======================
export const ListUserByID = async (id: number | string): Promise<UserResponse | null> => {
  try {
    const response = await userApi.get(`/users/${id}`);

    console.log("ListUserByID raw response:", response.data);

    if (response.data && typeof response.data === "object") {
      return response.data as UserResponse;
    }

    console.error("Unexpected ListUserByID response:", response.data);
    return null;
  } catch (error) {
    console.error("ListUserByID error:", error);
    return null;
  }
};

// =======================
// API: POST /users
// =======================
export const CreateUser = async (
  payload: CreateUserInput
): Promise<UserResponse | null> => {
  try {
    const response = await userApi.post("/create-users", payload);

    console.log("CreateUser raw response:", response.data);

    if (response.data && typeof response.data === "object") {
      return response.data as UserResponse;
    }

    console.error("Unexpected CreateUser response:", response.data);
    return null;
  } catch (error) {
    console.error("CreateUser error:", error);
    return null;
  }
};

// =======================
// API: PATCH /update-users/:id
// =======================
export const UpdateUserByID = async (
  id: number | string,
  payload: UpdateUserInput
): Promise<UserResponse | null> => {
  try {
    const response = await userApi.patch(`/update-users/${id}`, payload);

    console.log("UpdateUserByID raw response:", response.data);

    if (response.data && typeof response.data === "object") {
      return response.data as UserResponse;
    }

    console.error("Unexpected UpdateUserByID response:", response.data);
    return null;
  } catch (error) {
    console.error("UpdateUserByID error:", error);
    return null;
  }
};

// =======================
// API: DELETE /delete-users/:id
// =======================
export const DeleteUserByID = async (
  id: number | string
): Promise<DeleteUserResponse | null> => {
  try {
    const response = await userApi.delete(`/delete-users/${id}`);

    console.log("DeleteUserByID raw response:", response.data);

    if (response.data && response.data.message) {
      return response.data as DeleteUserResponse;
    }

    console.error("Unexpected DeleteUserByID response:", response.data);
    return null;
  } catch (error) {
    console.error("DeleteUserByID error:", error);
    return null;
  }
};

export default userApi;


export type RoleResponse = {
  id: number;
  role: string;
};

export type UpdateUserByAdminPayload = {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  profile?: string;
  phone_number?: string;
  location?: string;
  position?: string;
  app_role_id?: number;
};

export type UpdateUserByAdminResponse = {
  message?: string;
  data?: UserResponse;
  error?: string;
};

// =======================
// API: GET /roles
// =======================
export const ListRoles = async (): Promise<RoleResponse[] | null> => {
  try {
    const response = await userApi.get("/roles");

    console.log("ListRoles raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as RoleResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as RoleResponse[];
    }

    console.error("Expected role array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListRoles error:", error);
    return null;
  }
};

// =======================
// API: PATCH /admin/users/:id
// =======================
export const UpdateUserIDByAdmin = async (
  id: number,
  payload: UpdateUserByAdminPayload
): Promise<UpdateUserByAdminResponse> => {
  try {
    const response = await userApi.patch(`/admin/users/${id}`, payload);

    console.log("UpdateUserIDByAdmin raw response:", response.data);

    return response.data as UpdateUserByAdminResponse;
  } catch (error: any) {
    console.error("UpdateUserIDByAdmin error:", error);

    return (
      error?.response?.data || {
        error: "Update user by admin failed",
      }
    );
  }
};

export interface SendEmailResponse {
  id: number;
  email: string;
  pass_app: string;
}

export interface UpdateSendEmailPayload {
  email: string;
  pass_app: string;
}

// =======================
// API: GET /send-emails
// =======================
export const ListSendEmails = async (): Promise<SendEmailResponse[] | null> => {
  try {
    const response = await userApi.get("/send-emails");

    console.log("ListSendEmails raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as SendEmailResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as SendEmailResponse[];
    }

    console.error("Expected send email array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListSendEmails error:", error);
    return null;
  }
};

// =======================
// API: PUT /send-email/:id
// =======================
export const UpdateSendEmailByID = async (
  id: number,
  payload: UpdateSendEmailPayload
): Promise<SendEmailResponse | null> => {
  try {
    const response = await userApi.put(`/send-email/${id}`, payload);

    console.log("UpdateSendEmailByID raw response:", response.data);

    if (response.data?.data) {
      return response.data.data as SendEmailResponse;
    }

    if (response.data?.id) {
      return response.data as SendEmailResponse;
    }

    console.error("Expected updated send email object but got:", response.data);
    return null;
  } catch (error) {
    console.error("UpdateSendEmailByID error:", error);
    return null;
  }
};