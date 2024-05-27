const BASE_URL = 'http://192.168.1.14:3001';

export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  SET_PASSWORD: `${BASE_URL}/users/set-password`
};
