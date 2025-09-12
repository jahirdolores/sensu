import Constants from 'expo-constants';

// Configuración de APIs
export const API_CONFIG = {
  // API key de Google Maps desde variables de entorno
  GOOGLE_MAPS_API_KEY: Constants.expoConfig?.extra?.API_KEY_GMAPS || 'TU_API_KEY_DE_GOOGLE_MAPS_AQUI',
  
  // Servidor del reloj desde variables de entorno
  WATCH_SERVER_URL: Constants.expoConfig?.extra?.WATCH_SERVER_URL || 'http://192.168.1.65:8000',
  
  // Código IMEI del reloj desde variables de entorno
  WATCH_IMEI_CODE: Constants.expoConfig?.extra?.WATCH_IMEI_CODE || '861265062812547',
  
  // Endpoint para obtener la ubicación del reloj
  get WATCH_LOCATION_API() {
    return `${this.WATCH_SERVER_URL}/api/watches/${this.WATCH_IMEI_CODE}/location`;
  },
  
  // Intervalo de actualización en milisegundos (30 segundos)
  UPDATE_INTERVAL: 10000,
  
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
