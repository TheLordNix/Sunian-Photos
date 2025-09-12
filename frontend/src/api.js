import { getAuthToken } from "./auth"; // Correct import path

const BASE_URL = "http://localhost:8000/api"; // Replace with your backend URL

const makeAuthorizedRequest = async (url, method, data = null) => {
  const token = await getAuthToken(); // Call the function to get the token
  if (!token) {
    throw new Error("Authentication token not found.");
  }

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
    const errorData = await response.json();
    throw new Error(errorData.detail || "API request failed");
  }

  return response.json();
};

// --- Your API Functions ---

const makeFileUploadRequest = async (url, method, formData) => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const headers = {
    // DO NOT set 'Content-Type': 'multipart/form-data'. This is handled automatically.
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
    body: formData, // Pass the FormData object directly
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "API request failed");
  }

  return response.json();
};
export const uploadPhoto = async (file, title, album_id, privacy) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (album_id) formData.append('album_id', album_id);
  formData.append('privacy', privacy);

  return await makeFileUploadRequest(`http://localhost:8000/api/images/photos`, "POST", formData);
};

export const editPhoto = async (photoId, photoData) => {
  return await makeAuthorizedRequest(`${BASE_URL}/images/photos/${photoId}`, "PUT", photoData);
};

export const deletePhoto = async (photoId) => {
  return await makeAuthorizedRequest(`${BASE_URL}/images/photos/${photoId}`, "DELETE");
};

export const getAllPhotos = async () => {
  const response = await fetch(`${BASE_URL}/photos`);
  if (!response.ok) {
    throw new Error("Failed to fetch photos.");
  }
  return response.json();
};