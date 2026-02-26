// src/services/vulnerability.ts
import axios from "axios";

// ✅ ปรับให้ตรงกับโปรเจกต์คุณ
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:9000";

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

  // กันกรณีไม่มี token
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
      // backend อาจคืน array ตรงๆ หรือ {data: [...]}
      const data = response.data?.data ?? response.data;
      return data as TaskStatusDTO[];
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
      // backend อาจคืน array ตรงๆ หรือ {data: [...]}
      const data = response.data?.data ?? response.data;
      return data as TaskVulnSummaryDTO[];
    }

    console.error("Unexpected status:", response.status);
    return null;
  } catch (error) {
    console.error("Error fetching task vulnerability summary:", error);
    return null;
  }
};