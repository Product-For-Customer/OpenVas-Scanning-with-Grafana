// src/services/vulnerability.ts
import axios from "axios";

// ✅ ปรับให้ตรงกับโปรเจกต์คุณ
const apiUrl = "https://17fa-180-183-245-221.ngrok-free.app";

// =======================
// Types
// =======================
export type TaskStatusDTO = {
  task_id: string;
  task_name: string;
  mac_address: string;
  status: "Done" | "Running" | "New" | "Stopped" | string;
  count: number;
};

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
// API: GET /tasks/status
// =======================
export const ListTaskStatus = async (): Promise<TaskStatusDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/tasks/status`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching task status:", error);
    return null;
  }
};

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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching task vulnerability summary:", error);
    return null;
  }
};

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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching vulnerabilities list:", error);
    return null;
  }
};

// services/assetRisk.ts
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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching asset risk list:", error);
    return null;
  }
};

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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching device risk list:", error);
    return null;
  }
};

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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      timeout: 20000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? data : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching vulnerability detail:", error);
    return null;
  }
};