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

export default publicReportApi;