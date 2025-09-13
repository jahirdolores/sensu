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

// Tipos para métricas de salud del reloj
export interface WatchMetrics {
  heartRate?: {
    current: number;
    resting: number;
    max: number;
    zone: 'rest' | 'fat_burn' | 'cardio' | 'peak';
    timestamp: string;
  };
  oxygen?: {
    saturation: number;
    timestamp: string;
  };
  temperature?: {
    body: number;
    ambient: number;
    timestamp: string;
  };
  activity?: {
    steps: number;
    calories: number;
    distance: number;
    timestamp: string;
  };
  battery: {
    level: number;
    charging: boolean;
    timestamp: string;
  };
  lastUpdate: string;
}

// Tipos para eventos de caída
export interface FallEvent {
  id: string;
  imei: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'confirmed' | 'false_alarm' | 'resolved';
  battery: number;
  gsm_signal: number;
  satellites: number;
}

// Tipos para alertas del reloj
export interface WatchAlarm {
  id: string;
  imei: string;
  type: 'sos' | 'fall' | 'low_battery' | 'no_signal' | 'geofence' | 'heart_rate' | 'temperature';
  status: 'active' | 'inactive' | 'acknowledged' | 'resolved';
  timestamp: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Tipos para estado del reloj
export interface WatchStatus {
  imei: string;
  online: boolean;
  lastSeen: string;
  battery: number;
  gsm_signal: number;
  satellites: number;
  working_mode: number;
  fortification_state: number;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

// Tipos para estadísticas de eventos
export interface FallEventStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  lastEvent?: string;
}
