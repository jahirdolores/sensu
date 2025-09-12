// Tipos para la respuesta del API del reloj
export interface WatchLocationResponse {
  raw: string;
  received_at: string;
  parsed: {
    raw: string;
    valid: boolean;
    date: string;
    time_utc: string;
    timestamp_utc: string | null;
    latitude: number;
    longitude: number;
    lat_ddmm: string;
    lon_ddmm: string;
    speed_kmh: number;
    direction_deg: number;
    status: {
      gsm_signal: number;
      satellites: number;
      battery: number;
      remaining_space: number;
      fortification_state: number;
      working_mode: number;
    };
    lbs: {
      mcc: number;
      mnc: number;
      lac: number;
      cid: number;
    };
    wifi: Array<{
      ssid: string | null;
      mac: string;
      rssi: number;
    }>;
  };
}

// Tipo simplificado para usar en la aplicación
export interface WatchLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  battery: number;
  satellites: number;
  gsm_signal: number;
  speed_kmh: number;
  direction_deg: number;
}

// Tipo para los parámetros de la solicitud
export interface WatchLocationParams {
  imeiCode: string;
  serverUrl: string;
}

// Tipos para comandos del reloj
export interface SendCommandRequest {
  command: string;
  params?: string | null;
}

export interface RawCommandRequest {
  payload: string;
}

export interface CommandResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface CommandParams {
  imeiCode?: string;
  serverUrl?: string;
}
