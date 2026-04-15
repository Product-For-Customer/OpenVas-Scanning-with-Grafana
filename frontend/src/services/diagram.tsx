import axios from "axios";
import { apiUrl } from "./api";

// =======================
// Axios instance for cookie-based auth
// =======================
const diagramApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// =======================
// Types: Diagram
// =======================
export type DiagramResponse = {
  id: number;
  name: string;
  description: string;
  image_base64: string;
  created_at?: string;
  updated_at?: string;
  message?: string;
  error?: string;
};

export type CreateDiagramInput = {
  name: string;
  description?: string;
  image_base64: string;
};

export type UpdateDiagramInput = {
  name?: string;
  description?: string;
  image_base64?: string;
};

export type DeleteDiagramResponse = {
  message: string;
};

// =======================
// Types: AppDiagramNode
// =======================
export type DiagramInfo = {
  id: number;
  name: string;
  description: string;
  image_base64: string;
  created_at?: string;
  updated_at?: string;
};

export type AppLocationResponse = {
  id: number;
  location: string;
  building: string;
  floor: number;
  latitude: number;
  longtitude: number;
  app_diagram_node_id: number;
  created_at?: string;
  updated_at?: string;
};

export type AppDiagramNodeResponse = {
  id: number;
  diagram_id: number;
  diagram?: DiagramInfo | null;
  task_id: string;
  label: string;
  description: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  app_locations?: AppLocationResponse[];
  created_at?: string;
  updated_at?: string;
  message?: string;
  error?: string;
};

export type CreateAppDiagramNodeInput = {
  diagram_id: number;
  task_id: string;
  label: string;
  description?: string;
  icon?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  z_index?: number;
};

export type UpdateAppDiagramNodeInput = {
  diagram_id?: number;
  task_id?: string;
  label?: string;
  description?: string;
  icon?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  z_index?: number;
};

export type DeleteAppDiagramNodeResponse = {
  message: string;
};

// =======================
// Helpers
// =======================
const normalizeDiagram = (raw: any): DiagramResponse => {
  return {
    id: Number(raw?.id ?? 0),
    name: String(raw?.name ?? ""),
    description: String(raw?.description ?? ""),
    image_base64: String(raw?.image_base64 ?? ""),
    created_at: raw?.created_at ? String(raw.created_at) : undefined,
    updated_at: raw?.updated_at ? String(raw.updated_at) : undefined,
    message: raw?.message ? String(raw.message) : undefined,
    error: raw?.error ? String(raw.error) : undefined,
  };
};

const normalizeDiagramInfo = (raw: any): DiagramInfo => {
  return {
    id: Number(raw?.id ?? 0),
    name: String(raw?.name ?? ""),
    description: String(raw?.description ?? ""),
    image_base64: String(raw?.image_base64 ?? ""),
    created_at: raw?.created_at ? String(raw.created_at) : undefined,
    updated_at: raw?.updated_at ? String(raw.updated_at) : undefined,
  };
};

const normalizeAppLocation = (raw: any): AppLocationResponse => {
  return {
    id: Number(raw?.id ?? 0),
    location: String(raw?.location ?? ""),
    building: String(raw?.building ?? ""),
    floor: Number(raw?.floor ?? 0),
    latitude: Number(raw?.latitude ?? 0),
    longtitude: Number(raw?.longtitude ?? 0),
    app_diagram_node_id: Number(raw?.app_diagram_node_id ?? 0),
    created_at: raw?.created_at ? String(raw.created_at) : undefined,
    updated_at: raw?.updated_at ? String(raw.updated_at) : undefined,
  };
};

const normalizeAppDiagramNode = (raw: any): AppDiagramNodeResponse => {
  return {
    id: Number(raw?.id ?? 0),
    diagram_id: Number(raw?.diagram_id ?? 0),
    diagram: raw?.diagram ? normalizeDiagramInfo(raw.diagram) : null,
    task_id: String(raw?.task_id ?? ""),
    label: String(raw?.label ?? ""),
    description: String(raw?.description ?? ""),
    icon: String(raw?.icon ?? ""),
    x: Number(raw?.x ?? 0),
    y: Number(raw?.y ?? 0),
    width: Number(raw?.width ?? 0),
    height: Number(raw?.height ?? 0),
    z_index: Number(raw?.z_index ?? 0),
    app_locations: Array.isArray(raw?.app_locations)
      ? raw.app_locations.map((item: any) => normalizeAppLocation(item))
      : [],
    created_at: raw?.created_at ? String(raw.created_at) : undefined,
    updated_at: raw?.updated_at ? String(raw.updated_at) : undefined,
    message: raw?.message ? String(raw.message) : undefined,
    error: raw?.error ? String(raw.error) : undefined,
  };
};

// =======================
// Diagram APIs
// =======================

// GET /diagrams
export const ListDiagrams = async (): Promise<DiagramResponse[] | null> => {
  try {
    const response = await diagramApi.get("/diagrams");

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data.map((item) => normalizeDiagram(item));
    }

    console.error("Expected diagram array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListDiagrams error:", error);
    return null;
  }
};

// GET /diagrams/:id
export const ListDiagramByID = async (
  id: number | string
): Promise<DiagramResponse | null> => {
  try {
    const response = await diagramApi.get(`/diagrams/${id}`);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeDiagram(data);
    }

    console.error("Unexpected ListDiagramByID response:", response.data);
    return null;
  } catch (error) {
    console.error("ListDiagramByID error:", error);
    return null;
  }
};

// POST /create-diagrams
export const CreateDiagram = async (
  payload: CreateDiagramInput
): Promise<DiagramResponse | null> => {
  try {
    const response = await diagramApi.post("/create-diagrams", payload);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeDiagram(data);
    }

    console.error("Unexpected CreateDiagram response:", response.data);
    return null;
  } catch (error) {
    console.error("CreateDiagram error:", error);
    return null;
  }
};

// PATCH /update-diagrams/:id
export const UpdateDiagramByID = async (
  id: number | string,
  payload: UpdateDiagramInput
): Promise<DiagramResponse | null> => {
  try {
    const response = await diagramApi.patch(`/update-diagrams/${id}`, payload);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeDiagram(data);
    }

    console.error("Unexpected UpdateDiagramByID response:", response.data);
    return null;
  } catch (error) {
    console.error("UpdateDiagramByID error:", error);
    return null;
  }
};

// DELETE /delete-diagrams/:id
export const DeleteDiagramByID = async (
  id: number | string
): Promise<DeleteDiagramResponse | null> => {
  try {
    const response = await diagramApi.delete(`/delete-diagrams/${id}`);

    if (response.data && response.data.message) {
      return {
        message: String(response.data.message),
      };
    }

    console.error("Unexpected DeleteDiagramByID response:", response.data);
    return null;
  } catch (error) {
    console.error("DeleteDiagramByID error:", error);
    return null;
  }
};

// =======================
// AppDiagramNode APIs
// =======================

// GET /diagram-nodes
export const ListAppDiagramNodes = async (): Promise<AppDiagramNodeResponse[] | null> => {
  try {
    const response = await diagramApi.get("/diagram-nodes");

    const data = response.data?.data ?? response.data;

    if (Array.isArray(data)) {
      return data.map((item) => normalizeAppDiagramNode(item));
    }

    console.error("Expected app diagram node array but got:", response.data);
    return null;
  } catch (error) {
    console.error("ListAppDiagramNodes error:", error);
    return null;
  }
};

// GET /diagram-nodes/:id
export const ListAppDiagramNodeByID = async (
  id: number | string
): Promise<AppDiagramNodeResponse | null> => {
  try {
    const response = await diagramApi.get(`/diagram-nodes/${id}`);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeAppDiagramNode(data);
    }

    console.error("Unexpected ListAppDiagramNodeByID response:", response.data);
    return null;
  } catch (error) {
    console.error("ListAppDiagramNodeByID error:", error);
    return null;
  }
};

// POST /create-diagram-nodes
export const CreateAppDiagramNode = async (
  payload: CreateAppDiagramNodeInput
): Promise<AppDiagramNodeResponse | null> => {
  try {
    const response = await diagramApi.post("/create-diagram-nodes", payload);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeAppDiagramNode(data);
    }

    console.error("Unexpected CreateAppDiagramNode response:", response.data);
    return null;
  } catch (error) {
    console.error("CreateAppDiagramNode error:", error);
    return null;
  }
};

// PATCH /update-diagram-nodes/:id
export const UpdateAppDiagramNodeByID = async (
  id: number | string,
  payload: UpdateAppDiagramNodeInput
): Promise<AppDiagramNodeResponse | null> => {
  try {
    const response = await diagramApi.patch(`/update-diagram-nodes/${id}`, payload);

    const data = response.data?.data ?? response.data;

    if (data && typeof data === "object") {
      return normalizeAppDiagramNode(data);
    }

    console.error("Unexpected UpdateAppDiagramNodeByID response:", response.data);
    return null;
  } catch (error) {
    console.error("UpdateAppDiagramNodeByID error:", error);
    return null;
  }
};

// DELETE /delete-diagram-nodes/:id
export const DeleteAppDiagramNodeByID = async (
  id: number | string
): Promise<DeleteAppDiagramNodeResponse | null> => {
  try {
    const response = await diagramApi.delete(`/delete-diagram-nodes/${id}`);

    if (response.data && response.data.message) {
      return {
        message: String(response.data.message),
      };
    }

    console.error("Unexpected DeleteAppDiagramNodeByID response:", response.data);
    return null;
  } catch (error) {
    console.error("DeleteAppDiagramNodeByID error:", error);
    return null;
  }
};

export default diagramApi;