
const BASE_URL = 'http://192.168.1.254:3001';


export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  SET_PASSWORD: `${BASE_URL}/users/set-password`,

  REMINDER: `${BASE_URL}/reminders`,
  REMINDERS: (username) => `${BASE_URL}/reminders/${username}`,
  MODIFY_REMINDER: (id) => `${BASE_URL}/reminders/${id}`,

  GET_EVENTS_BY_DATE: (email,date) => `${BASE_URL}/events/${email}/${date}`,
  UPDATE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  CREATE_EVENT: `${BASE_URL}/events`,
  DELETE_EVENT: (id) => `${BASE_URL}/events/${id}`,

};
