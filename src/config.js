
const BASE_URL = 'http://10.227.63.223:3001';


export const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users/`,
  LOGIN: `${BASE_URL}/users/login`,
  USER: (email) => `${BASE_URL}/users/${email}`,
  UPLOAD_PROFILE_PICTURE: (email) => `${BASE_URL}/users/upload-profile-picture/${email}`,

  REMINDER: `${BASE_URL}/reminders`,
  REMINDERS: (username) => `${BASE_URL}/reminders/${username}`,
  MODIFY_REMINDER: (id) => `${BASE_URL}/reminders/${id}`,
  SEARCH_REMINDER: (email) => `${BASE_URL}/reminders/search/${email}`,


  GET_EVENTS_BY_DATE: (email,date) => `${BASE_URL}/events/${email}/${date}`,
  UPDATE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  CREATE_EVENT: `${BASE_URL}/events`,
  DELETE_EVENT: (id) => `${BASE_URL}/events/${id}`,
  SEARCH_EVENTS: (email) => `${BASE_URL}/events/search-filter/${email}`,

};
