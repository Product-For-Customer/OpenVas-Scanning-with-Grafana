import axios from "axios";
import { apiUrl } from "./api";

// =======================
// Axios instance for PUBLIC report endpoints
// ไม่ส่ง cookie / credential
// =======================
const publicReportApi = axios.create({
  baseURL: apiUrl,
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// =======================
// Types: GET /tasks/summary-vulnerability
// =======================
export type TaskVulnSummaryForReportResponse = {
  task_id: string;
  task_name: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
};

// =======================
// API: GET /tasks/summary-vulnerability
// Public route: no login required
// =======================
export const ListTaskVulnSummaryForReport = async (): Promise<
  TaskVulnSummaryForReportResponse[] | null
> => {
  try {
    const response = await publicReportApi.get("/summary-vulnerability-report");

    console.log("ListTaskVulnSummaryForReport raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as TaskVulnSummaryForReportResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as TaskVulnSummaryForReportResponse[];
    }

    console.error(
      "Expected array but got in ListTaskVulnSummaryForReport:",
      response.data
    );
    return null;
  } catch (error) {
    console.error("ListTaskVulnSummaryForReport error:", error);
    return null;
  }
};

// =======================
// Types: GET /critical-report
// =======================
export type CriticalForReportResponse = {
  task_name: string;
  ip: string;
  vulnerability_name: string;
  vulnerability_family: string;
  level: string;
  summary: string;
  insight: string;
  cve_list: string;
  severity: number;
};

// =======================
// API: GET /critical-report
// Public route: no login required
// =======================
export const ListCriticalForReport = async (): Promise<
  CriticalForReportResponse[] | null
> => {
  try {
    const response = await publicReportApi.get("/critical-report");

    console.log("ListCriticalForReport raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as CriticalForReportResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as CriticalForReportResponse[];
    }

    console.error("Expected array but got in ListCriticalForReport:", response.data);
    return null;
  } catch (error) {
    console.error("ListCriticalForReport error:", error);
    return null;
  }
};

// =======================
// Types: GET /devices/risk
// =======================
export type DeviceRiskForReportDTO = {
  task_id: string;
  task_name: string;
  ip_address: string;
  firmware_version: string;
  risk_score: number;
  vulnerability_total: number;
};

// =======================
// API: GET /devices/risk
// Public route: no login required
// =======================
export const ListDeviceRiskForReport = async (): Promise<
  DeviceRiskForReportDTO[] | null
> => {
  try {
    const response = await publicReportApi.get("/devices/risk-report");

    console.log("ListDeviceRiskForReport raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as DeviceRiskForReportDTO[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as DeviceRiskForReportDTO[];
    }

    console.error(
      "Expected array but got in ListDeviceRiskForReport:",
      response.data
    );
    return null;
  } catch (error) {
    console.error("ListDeviceRiskForReport error:", error);
    return null;
  }
};

// =======================
// Types: GET /target-differ-report
// =======================
export type TargetDifferForReportDTO = {
  host: string;
  task_name: string;

  latest_task_id: string;
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

// =======================
// API: GET /target-differ-report
// Public route: no login required
// =======================
export const ListTargetDifferForReport = async (): Promise<
  TargetDifferForReportDTO[] | null
> => {
  try {
    const response = await publicReportApi.get("/target-differ-report");

    console.log("ListTargetDifferForReport raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as TargetDifferForReportDTO[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as TargetDifferForReportDTO[];
    }

    console.error(
      "Expected array but got in ListTargetDifferForReport:",
      response.data
    );
    return null;
  } catch (error) {
    console.error("ListTargetDifferForReport error:", error);
    return null;
  }
};

export default publicReportApi;