import axios from "axios";
//
export const apiUrl = "https://c6c3-171-97-98-241.ngrok-free.app"; // เปลี่ยนเป็น URL ของ API ของคุณ http://localhost:9000 and https://c6c3-171-97-98-241.ngrok-free.app

export const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export const baseApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: defaultHeaders,
});