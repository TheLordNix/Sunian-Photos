import { getAuthToken } from "./auth";

const BASE_URL = "http://localhost:8000/api";

// ---------- Helpers ----------
const makeAuthorizedRequest = async (url, method, data = null) => {
  const token = await getAuthToken();
  if (!token) throw new Error("Authentication token not found.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }
  return response.json();
};

const makeFileUploadRequest = async (url, method, formData) => {
  const token = await getAuthToken();
  if (!token) throw new Error("Authentication token not found.");

  const headers = {
    Authorization: `Bearer ${token}`, // Let browser set Content-Type
  };

  const options = { method, headers, body: formData };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }
  return response.json();
};

// ---------- API Functions ----------

// Upload image
export const uploadPhoto = async (file, title, album_id, privacy = "public") => {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (album_id) formData.append("album_id", album_id);
  formData.append("privacy", privacy);

  return await makeFileUploadRequest(`${BASE_URL}/upload`, "POST", formData);
};

// Edit image metadata
export const editPhoto = async (photoId, photoData) => {
  return await makeAuthorizedRequest(`${BASE_URL}/images/${photoId}/edit`, "POST", photoData);
};

// Delete image
export const deletePhoto = async (photoId) => {
  return await makeAuthorizedRequest(`${BASE_URL}/images/${photoId}`, "DELETE");
};

// Get all images
export const getAllPhotos = async () => {
  const response = await fetch(`${BASE_URL}/images`);
  if (!response.ok) throw new Error("Failed to fetch images.");
  return response.json();
};
