import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000";

const ADMIN_TOKEN_KEY = "ornate_admin_token";

export const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  timeout: 20000,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export async function uploadImageToImageKit(file: File): Promise<{
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl: string;
}> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await adminApi.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}
