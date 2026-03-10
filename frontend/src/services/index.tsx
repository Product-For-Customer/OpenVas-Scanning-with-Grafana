// src/services/vulnerability.ts
import axios from "axios";
export * from "./auth";
export * from "./user";
export * from "./line";
import { apiUrl } from "./api";

// =======================
// Auth header helper test
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
  task_id: string;
  task_name: string;
  mac_address: string;
  detected_date: string;
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

export const ListVulnerabilityByTaskID = async (
  taskID: string
): Promise<VulnerabilityLevelDTO[] | null> => {
  try {
    if (!taskID || !taskID.trim()) {
      console.error("taskID is required");
      return [];
    }

    const response = await axios.get(
      `${apiUrl}/vulnerabilities/${encodeURIComponent(taskID.trim())}`,
      {
        headers: getCommonHeaders(),
        timeout: 15000,
      }
    );

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as VulnerabilityLevelDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error(`Error fetching vulnerabilities by task ID (${taskID}):`, error);
    return null;
  }
};

// =======================
// API: GET /target-differ
// =======================
export type TargetDifferDTO = {
  mac_address: string;

  latest_task_id: string;
  latest_task_name: string;
  latest_host: string;
  latest_report_id: number;
  latest_creation_time: number | null;
  latest_total: number;
  latest_critical: number;
  latest_high: number;
  latest_medium: number;
  latest_low: number;
  latest_info: number;
  latest_risk_score: number;

  previous_task_id: string | null;
  previous_task_name: string | null;
  previous_host: string | null;
  previous_report_id: number | null;
  previous_creation_time: number | null;
  previous_total: number | null;
  previous_critical: number | null;
  previous_high: number | null;
  previous_medium: number | null;
  previous_low: number | null;
  previous_info: number | null;
  previous_risk_score: number | null;

  previous_version_status: string;

  diff_total: number | null;
  diff_critical: number | null;
  diff_high: number | null;
  diff_medium: number | null;
  diff_low: number | null;
  diff_info: number | null;
  diff_risk_score: number | null;
};

export const ListTargetDiffer = async (): Promise<TargetDifferDTO[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/target-differ`, {
      headers: getCommonHeaders(),
      timeout: 15000,
    });

    if (response.status === 200) {
      const data = response.data?.data ?? response.data;
      return Array.isArray(data) ? (data as TargetDifferDTO[]) : [];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching target differ list:", error);
    return null;
  }
};