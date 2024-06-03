const BASE_URL = 'http://192.168.1.14:3001';

export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users/`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  UPLOAD_PROFILE_PICTURE: (username) => `${BASE_URL}/users/${username}/upload-profile-picture`,
};
