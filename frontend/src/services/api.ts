import axios from "axios";

export const apiUrl = "https://2751-49-0-82-165.ngrok-free.app";

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