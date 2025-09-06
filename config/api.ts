import Constants from 'expo-constants';

// Configuración de APIs
export const API_CONFIG = {
  // API key de Google Maps desde variables de entorno
  GOOGLE_MAPS_API_KEY: Constants.expoConfig?.extra?.API_KEY_GMAPS || 'TU_API_KEY_DE_GOOGLE_MAPS_AQUI',
  
  // Endpoint para obtener la ubicación del reloj desde variables de entorno
  WATCH_LOCATION_API: Constants.expoConfig?.extra?.WATCH_LOCATION_API || 'https://tu-api.com/watch-location',
  
  // Intervalo de actualización en milisegundos (30 segundos)
  UPDATE_INTERVAL: 30000,
  
  // Ubicación por defecto (Ciudad de México)
  DEFAULT_LOCATION: {
    latitude: 19.4326,
    longitude: -99.1332,
  },
};

// Headers por defecto para las peticiones API
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  // Agrega aquí tu token de autenticación si es necesario
  // 'Authorization': 'Bearer tu-token'
};
