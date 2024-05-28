
const BASE_URL = 'http://10.10.2.149:3001';


export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  SET_PASSWORD: `${BASE_URL}/users/set-password`,
  REMINDER: `${BASE_URL}/reminders`,
  REMINDERS: (username) => `${BASE_URL}/reminders/${username}`,
  MODIFY_REMINDER: (id) => `${BASE_URL}/reminders/${id}`
};
