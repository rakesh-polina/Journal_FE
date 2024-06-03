
const BASE_URL = 'http://10.227.63.223:3001';


export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users/`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  UPLOAD_PROFILE_PICTURE: (username) => `${BASE_URL}/users/${username}/upload-profile-picture`,,
  REMINDER: `${BASE_URL}/reminders`,
  REMINDERS: (username) => `${BASE_URL}/reminders/${username}`,
  MODIFY_REMINDER: (id) => `${BASE_URL}/reminders/${id}`
};
