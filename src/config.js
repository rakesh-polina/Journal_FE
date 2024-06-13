
const BASE_URL = 'http://192.168.1.14:3001';


export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users/`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  UPLOAD_PROFILE_PICTURE: (email) => `${BASE_URL}/users/upload-profile-picture/${email}`,
  REMINDER: `${BASE_URL}/reminders`,
  REMINDERS: (username) => `${BASE_URL}/reminders/${username}`,
  MODIFY_REMINDER: (id) => `${BASE_URL}/reminders/${id}`
};
