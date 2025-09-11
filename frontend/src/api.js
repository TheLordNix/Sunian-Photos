import { getAuthToken } from "./auth"; // Correct import path

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL

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

export const uploadPhoto = async (photoData) => {
  return await makeAuthorizedRequest(`${BASE_URL}/photos`, "POST", photoData);
};

export const editPhoto = async (photoId, photoData) => {
  return await makeAuthorizedRequest(`${BASE_URL}/photos/${photoId}`, "PUT", photoData);
};

export const deletePhoto = async (photoId) => {
  return await makeAuthorizedRequest(`${BASE_URL}/photos/${photoId}`, "DELETE");
};

export const getAllPhotos = async () => {
  const response = await fetch(`${BASE_URL}/photos`);
  if (!response.ok) {
    throw new Error("Failed to fetch photos.");
  }
  return response.json();
};