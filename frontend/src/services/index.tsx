// src/services/vulnerability.ts
import axios from "axios";

// ✅ ปรับให้ตรงกับโปรเจกต์คุณ
const apiUrl = "https://6154-58-8-148-185.ngrok-free.app";

// =======================
// Auth header helper
// =======================
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  if (!token || !tokenType) return {};
  return { Authorization: `${tokenType} ${token}` };
};

// =======================
// Common header helper
// =======================
const getCommonHeaders = () => {
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...getAuthHeader(),
  };
};

// =======================
// API: GET /tasks/status
// =======================
export type TaskStatusDTO = {
  task_id: string;
  task_name: string;
  mac_address: string;
  status: string;
  count: number;
};

export const ListTaskStatus = async (): Promise<TaskStatusDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/tasks/status`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    console.log("Task status raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as TaskStatusDTO[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as TaskStatusDTO[];
    }

    console.error("Expected array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListTaskStatus error:", error);
    return null;
  }
};

// =======================
// API: GET /tasks/summary-vulnerability
// =======================
export type TaskVulnSummaryDTO = {
  task_id: string;
  task_name: string;
  mac_address: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
};

export const ListTaskVulnSummary = async (): Promise<TaskVulnSummaryDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/tasks/summary-vulnerability`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as TaskVulnSummaryDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching task vulnerability summary:", error);
    return null;
  }
};

// =======================
// API: GET /vulnerabilities/list
// =======================
export type VulnerabilityLevelDTO = {
  vulnerability_id: string;
  task_id: string;
  mac_address: string;
  vulnerability_family: string;
  vulnerability_name: string;
  level: "Critical" | "High" | "Medium" | "Low" | "Info";
  total: number;
  detected_time: string;
};

export const ListVulnerability = async (): Promise<VulnerabilityLevelDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/vulnerabilities/list`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as VulnerabilityLevelDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching vulnerabilities list:", error);
    return null;
  }
};

// =======================
// API: GET /assets/risk
// =======================
export type AssetRiskDTO = {
  task_name: string;
  mac_address: string;
  aging_day: number;
  vulnerability_total: number;
  risk_score: number;
};

export const ListAssetRisk = async (): Promise<AssetRiskDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/assets/risk`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as AssetRiskDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching asset risk list:", error);
    return null;
  }
};

// =======================
// API: GET /devices/risk
// =======================
export type DeviceRiskDTO = {
  task_name: string;
  ip_address: string;
  firmware_version: string;
  risk_score: number;
  vulnerability_total: number;
};

export const ListDeviceRisk = async (): Promise<DeviceRiskDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/devices/risk`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as DeviceRiskDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching device risk list:", error);
    return null;
  }
};

// =======================
// API: GET /vulnerabilities/detail/by-name
// =======================
export type VulnerabilityDetailDTO = {
  task_name: string;
  vulnerability_id: string;
  vulnerability_name: string;
  detected_date: string;
  severity: number;
  cve_list: string;
  summary: string;
  impact: string;
  affected: string;
  insight: string;
  solution: string;
  solution_type: string;
};

export const ListVulnerabilityDetailByName = async (
  task_id: string,
  name: string
): Promise<VulnerabilityDetailDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/vulnerabilities/detail/by-name`, {
      params: { task_id, name },
      headers: getCommonHeaders(),
      timeout: 20000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as VulnerabilityDetailDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching vulnerability detail:", error);
    return null;
  }
};