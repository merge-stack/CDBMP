const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://api.mappa.comunitadelboscomontepisano.it/api/v1';

export const API_ENDPOINTS = {
  // Map endpoints
  MAP_AREAS: '/map/areas',
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default API_CONFIG;
