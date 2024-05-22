const BASE_URL = 'http://10.10.2.149:3001';

export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`
};
