import axios from "axios";
import { apiUrl } from "./index";

// =======================
// Axios instance for cookie-based auth
// =======================
const historyNotifyApi = axios.create({
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
export type HistoryNotifyResponse = {
  id: number;
  subject: string;
  description: string;
  status: string;
  status_id: number | null;
  created_at: string;
  updated_at: string;
};

export type DeleteHistoryNotifyByIDsInput = {
  ids: number[];
};

export type DeleteHistoryNotifyByIDsResponse = {
  message: string;
  deleted_count: number;
  requested_ids: number[];
};

// =======================
// API: GET /history-notifies
// =======================
export const ListHistoryNotify = async (): Promise<HistoryNotifyResponse[] | null> => {
  try {
    const response = await historyNotifyApi.get("/history-notifies");

    console.log("ListHistoryNotify raw response:", response.data);

    if (Array.isArray(response.data)) {
      return response.data as HistoryNotifyResponse[];
    }

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data as HistoryNotifyResponse[];
    }

    console.error("Expected array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListHistoryNotify error:", error);
    return null;
  }
};

// =======================
// API: DELETE /delete-history-notifies
// body: { ids: [1,2,3] }
// =======================
export const DeleteHistoryNotifyByIDs = async (
  payload: DeleteHistoryNotifyByIDsInput
): Promise<DeleteHistoryNotifyByIDsResponse | null> => {
  try {
    const response = await historyNotifyApi.delete("/delete-history-notifies", {
      data: payload,
    });

    console.log("DeleteHistoryNotifyByIDs raw response:", response.data);

    if (
      response.data &&
      typeof response.data === "object" &&
      "message" in response.data
    ) {
      return response.data as DeleteHistoryNotifyByIDsResponse;
    }

    console.error("Unexpected DeleteHistoryNotifyByIDs response:", response.data);
    return null;
  } catch (error) {
    console.error("DeleteHistoryNotifyByIDs error:", error);
    return null;
  }
};

export default historyNotifyApi;