import { API_CONFIG, DEFAULT_HEADERS } from '@/config/api';
import {
  CommandParams,
  CommandResponse,
  FallEvent,
  FallEventStats,
  RawCommandRequest,
  SendCommandRequest,
  WatchAlarm,
  WatchLocation,
  WatchLocationParams,
  WatchMetrics,
  WatchStatus
} from '@/types/watch';

/**
 * Servicio para manejar las solicitudes HTTP al API del reloj
 */
export class WatchService {
  /**
   * Convierte el código de alarma a tipo legible
   */
  private static getAlarmTypeFromCode(code: string): 'sos' | 'fall' | 'no_signal' | 'low_battery' | 'geofence' | 'heart_rate' | 'temperature' {
    switch (code) {
      case '01': return 'sos';
      case '02': return 'fall';
      case '03': return 'no_signal';
      case '04': return 'low_battery';
      case '05': return 'geofence';
      case '06': return 'heart_rate';
      case '07': return 'temperature';
      default: return 'no_signal';
    }
  }

  /**
   * Convierte el tipo de alarma a prioridad
   */
  private static getPriorityFromAlarmType(type: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (type) {
      case 'sos': return 'critical';
      case 'fall': return 'critical';
      case 'heart_rate': return 'high';
      case 'temperature': return 'high';
      case 'low_battery': return 'medium';
      case 'geofence': return 'medium';
      case 'no_signal': return 'low';
      default: return 'medium';
    }
  }
  /**
   * Obtiene la ubicación del reloj desde el servidor
   * @param params Parámetros opcionales para personalizar la solicitud
   * @returns Promise con la ubicación del reloj o null si hay error
   */
  static async getWatchLocation(params?: Partial<WatchLocationParams>): Promise<WatchLocation | null> {
    try {
      // Construir la URL del endpoint
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/location`;

      console.log('Solicitando ubicación del reloj:', endpoint);

      // Crear un AbortController para manejar el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      // Realizar la solicitud HTTP
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          // Agregar headers adicionales si es necesario
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      // Limpiar el timeout si la respuesta es exitosa
      clearTimeout(timeoutId);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        // Si es 404, verificar si es por ubicación no disponible
        if (response.status === 404) {
          try {
            const errorData = await response.json();
            if (errorData.detail === "Location not available") {
              console.warn('Ubicación no disponible del reloj');
              return null;
            }
          } catch (e) {
            // Si no se puede parsear el error, continuar con el error original
          }
        }
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      // Parsear la respuesta JSON
      const data: any = await response.json();
      
      console.log('Watch location data received from API:', data);
      
      // Verificar si la API devuelve un objeto con estructura {value, received_at}
      if (data && typeof data === 'object' && data.value !== undefined && data.received_at !== undefined) {
        // La API está devolviendo datos en formato {value, received_at}
        console.warn('API devolviendo datos en formato {value, received_at}, usando ubicación por defecto');
        throw new Error('Formato de datos no soportado: {value, received_at}');
      }
      
      // Validar que los datos sean válidos según el formato esperado
      if (!data.parsed || !data.parsed.valid) {
        console.warn('Datos de ubicación inválidos del reloj:', {
          valid: data.parsed?.valid,
          latitude: data.parsed?.latitude,
          longitude: data.parsed?.longitude,
          satellites: data.parsed?.status?.satellites,
          battery: data.parsed?.status?.battery
        });
        
        // Si no hay satélites GPS, el reloj no puede obtener ubicación válida
        if (data.parsed?.status?.satellites === 0) {
          console.warn('Sin señal GPS: El reloj no puede obtener ubicación válida');
          // En lugar de lanzar error, retornar null para que useWatchLocation use ubicación por defecto
          return null;
        }
        
        console.warn('Los datos de ubicación no son válidos');
        return null;
      }

      // Convertir la respuesta a nuestro formato simplificado
      const watchLocation: WatchLocation = {
        latitude: data.parsed.latitude,
        longitude: data.parsed.longitude,
        timestamp: data.received_at,
        battery: data.parsed.status.battery,
        satellites: data.parsed.status.satellites,
        gsm_signal: data.parsed.status.gsm_signal,
        speed_kmh: data.parsed.speed_kmh,
        direction_deg: data.parsed.direction_deg,
      };

      console.log('Ubicación obtenida exitosamente:', watchLocation);
      return watchLocation;

    } catch (error) {
      console.error('Error al obtener la ubicación del reloj:', error);
      
      // Si es un error de timeout o red, retornar null
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Timeout al obtener la ubicación del reloj');
        } else if (error.message.includes('Network request failed')) {
          console.error('Error de red al obtener la ubicación del reloj');
          console.error('Verifica que:');
          console.error('1. El servidor esté ejecutándose');
          console.error('2. La URL sea correcta');
          console.error('3. Si usas simulador iOS, usa localhost en lugar de server');
          console.error('4. Si usas dispositivo físico, usa la IP real del servidor');
        } else if (error.message.includes('fetch')) {
          console.error('Error de conexión al servidor');
        }
      }
      
      return null;
    }
  }

  /**
   * Obtiene múltiples ubicaciones del reloj (para historial)
   * @param params Parámetros opcionales
   * @returns Promise con array de ubicaciones
   */
  static async getWatchLocationHistory(params?: Partial<WatchLocationParams>): Promise<WatchLocation[]> {
    try {
      // Esta función podría implementarse si el API soporta obtener historial
      // Por ahora retornamos un array vacío
      console.log('Función de historial no implementada aún');
      return [];
    } catch (error) {
      console.error('Error al obtener el historial de ubicaciones:', error);
      return [];
    }
  }

  /**
   * Verifica si el servidor del reloj está disponible
   * @param serverUrl URL del servidor a verificar
   * @returns Promise con boolean indicando si está disponible
   */
  static async checkServerHealth(serverUrl?: string): Promise<boolean> {
    try {
      const url = serverUrl || API_CONFIG.WATCH_SERVER_URL;
      
      // Crear un AbortController para manejar el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos
      
      // Usar el endpoint de health para verificar si el servidor está disponible
      const response = await fetch(`${url}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      // Limpiar el timeout si la respuesta es exitosa
      clearTimeout(timeoutId);
      
      return response.ok;
    } catch (error) {
      console.error('Error al verificar el estado del servidor:', error);
      return false;
    }
  }

  /**
   * Obtiene el estado general del reloj
   * @param params Parámetros opcionales
   * @returns Promise con el estado del reloj
   */
  static async getWatchStatus(params?: Partial<WatchLocationParams>): Promise<WatchStatus | null> {
    try {
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}`;

      console.log('Solicitando estado del reloj:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Estado del reloj recibido:', data);

      // Extraer datos del dispositivo desde la estructura de la API
      const device = data.device;
      const session = data.session;
      const lastAlarm = device?.last_alarm?.parsed;

      // Convertir la respuesta a nuestro formato
      const watchStatus: WatchStatus = {
        imei: imeiCode,
        online: device?.status === 'online' || session?.connected || false,
        lastSeen: device?.last_seen || session?.last_seen || new Date().toISOString(),
        battery: lastAlarm?.battery_level || device?.battery || 0,
        gsm_signal: lastAlarm?.gsm_signal || device?.gsm_signal || 0,
        satellites: lastAlarm?.satellites || device?.satellites || 0,
        working_mode: lastAlarm?.working_mode || device?.working_mode || 0,
        fortification_state: lastAlarm?.fortification_state || device?.fortification_state || 0,
        location: device?.last_location ? {
          latitude: device.last_location.latitude,
          longitude: device.last_location.longitude,
          timestamp: device.last_location.timestamp || new Date().toISOString(),
        } : undefined,
      };

      return watchStatus;

    } catch (error) {
      console.error('Error al obtener el estado del reloj:', error);
      return null;
    }
  }

  /**
   * Obtiene las métricas de salud del reloj
   * @param params Parámetros opcionales
   * @returns Promise con las métricas de salud
   */
  static async getWatchMetrics(params?: Partial<WatchLocationParams>): Promise<WatchMetrics | null> {
    try {
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/metrics`;

      console.log('Solicitando métricas del reloj:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Métricas del reloj recibidas:', data);

      // La API actual solo devuelve información de alarmas, no métricas de salud específicas
      // Por ahora, extraeremos datos básicos de la última alarma si está disponible
      const alarmEvents = data.alarm_events;
      
      // Convertir la respuesta a nuestro formato
      const watchMetrics: WatchMetrics = {
        // Las métricas específicas de salud no están disponibles en la API actual
        // Se mantienen como undefined para que la app use datos simulados
        heartRate: undefined,
        oxygen: undefined,
        temperature: undefined,
        activity: undefined,
        battery: {
          level: 0, // Se obtendrá del estado del reloj
          charging: false,
          timestamp: new Date().toISOString(),
        },
        lastUpdate: alarmEvents?.last_event || new Date().toISOString(),
      };

      return watchMetrics;

    } catch (error) {
      console.error('Error al obtener las métricas del reloj:', error);
      return null;
    }
  }

  /**
   * Obtiene los eventos de caída de un reloj específico
   * @param params Parámetros opcionales
   * @returns Promise con array de eventos de caída
   */
  static async getWatchFallEvents(params?: Partial<WatchLocationParams>): Promise<FallEvent[]> {
    try {
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/fall-events`;

      console.log('Solicitando eventos de caída del reloj:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Eventos de caída recibidos:', data);

      // Convertir la respuesta a nuestro formato
      const fallEvents: FallEvent[] = Array.isArray(data) ? data.map((event: any) => ({
        id: event.id || Date.now().toString(),
        imei: imeiCode,
        timestamp: event.timestamp || new Date().toISOString(),
        latitude: event.latitude || 0,
        longitude: event.longitude || 0,
        severity: event.severity || 'medium',
        status: event.status || 'detected',
        battery: event.battery || 0,
        gsm_signal: event.gsm_signal || 0,
        satellites: event.satellites || 0,
      })) : [];

      return fallEvents;

    } catch (error) {
      console.error('Error al obtener los eventos de caída:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los eventos de caída
   * @param serverUrl URL del servidor
   * @returns Promise con array de eventos de caída
   */
  static async getAllFallEvents(serverUrl?: string): Promise<FallEvent[]> {
    try {
      const url = serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const endpoint = `${url}/api/fall-events`;

      console.log('Solicitando todos los eventos de caída:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Todos los eventos de caída recibidos:', data);

      // Convertir la respuesta a nuestro formato
      const fallEvents: FallEvent[] = Array.isArray(data) ? data.map((event: any) => ({
        id: event.id || Date.now().toString(),
        imei: event.imei || '',
        timestamp: event.timestamp || new Date().toISOString(),
        latitude: event.latitude || 0,
        longitude: event.longitude || 0,
        severity: event.severity || 'medium',
        status: event.status || 'detected',
        battery: event.battery || 0,
        gsm_signal: event.gsm_signal || 0,
        satellites: event.satellites || 0,
      })) : [];

      return fallEvents;

    } catch (error) {
      console.error('Error al obtener todos los eventos de caída:', error);
      return [];
    }
  }

  /**
   * Obtiene las estadísticas de eventos de caída
   * @param serverUrl URL del servidor
   * @returns Promise con estadísticas de eventos
   */
  static async getFallEventStats(serverUrl?: string): Promise<FallEventStats | null> {
    try {
      const url = serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const endpoint = `${url}/api/fall-events/stats`;

      console.log('Solicitando estadísticas de eventos de caída:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Estadísticas de eventos de caída recibidas:', data);

      // Convertir la respuesta a nuestro formato
      const stats: FallEventStats = {
        total: data.total || 0,
        today: data.today || 0,
        thisWeek: data.this_week || 0,
        thisMonth: data.this_month || 0,
        bySeverity: {
          low: data.by_severity?.low || 0,
          medium: data.by_severity?.medium || 0,
          high: data.by_severity?.high || 0,
          critical: data.by_severity?.critical || 0,
        },
        lastEvent: data.last_event || undefined,
      };

      return stats;

    } catch (error) {
      console.error('Error al obtener las estadísticas de eventos de caída:', error);
      return null;
    }
  }

  /**
   * Obtiene la última alarma de un reloj específico
   * @param params Parámetros opcionales
   * @returns Promise con la última alarma
   */
  static async getWatchLatestAlarm(params?: Partial<WatchLocationParams>): Promise<WatchAlarm | null> {
    try {
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/alarm/latest`;

      console.log('Solicitando última alarma del reloj:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Última alarma del reloj recibida:', data);

      // Convertir la respuesta a nuestro formato
      const alarm: WatchAlarm = {
        id: data.id?.toString() || Date.now().toString(),
        imei: data.imei || imeiCode,
        type: WatchService.getAlarmTypeFromCode(data.alarm_type),
        status: 'active' as const, // Las alarmas del reloj están activas
        timestamp: data.timestamp || new Date().toISOString(),
        message: data.alarm_description || 'Alarma del reloj',
        priority: WatchService.getPriorityFromAlarmType(WatchService.getAlarmTypeFromCode(data.alarm_type)),
        location: data.latitude && data.longitude ? {
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
      };

      return alarm;

    } catch (error) {
      console.error('Error al obtener la última alarma del reloj:', error);
      return null;
    }
  }

  /**
   * Obtiene el historial de alarmas de un reloj específico
   * @param params Parámetros opcionales
   * @returns Promise con array de alarmas
   */
  static async getWatchAlarmEvents(params?: Partial<WatchLocationParams>): Promise<WatchAlarm[]> {
    try {
      const serverUrl = params?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = params?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/alarm/events`;

      console.log('Solicitando historial de alarmas del reloj:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Historial de alarmas del reloj recibido:', data);

      // Convertir la respuesta a nuestro formato
      const alarms: WatchAlarm[] = Array.isArray(data) ? data.map((alarm: any) => ({
        id: alarm.id?.toString() || Date.now().toString(),
        imei: alarm.imei || imeiCode,
        type: WatchService.getAlarmTypeFromCode(alarm.alarm_type),
        status: 'active' as const, // Las alarmas del reloj están activas
        timestamp: alarm.timestamp || new Date().toISOString(),
        message: alarm.alarm_description || 'Alarma del reloj',
        priority: WatchService.getPriorityFromAlarmType(WatchService.getAlarmTypeFromCode(alarm.alarm_type)),
        location: alarm.latitude && alarm.longitude ? {
          latitude: alarm.latitude,
          longitude: alarm.longitude,
        } : undefined,
      })) : [];

      return alarms;

    } catch (error) {
      console.error('Error al obtener el historial de alarmas del reloj:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los eventos de alarma
   * @param serverUrl URL del servidor
   * @returns Promise con array de alarmas
   */
  static async getAllAlarmEvents(serverUrl?: string): Promise<WatchAlarm[]> {
    try {
      const url = serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const endpoint = `${url}/api/alarm/events`;

      console.log('Solicitando todos los eventos de alarma:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Todos los eventos de alarma recibidos:', data);

      // Convertir la respuesta a nuestro formato
      const alarms: WatchAlarm[] = Array.isArray(data) ? data.map((alarm: any) => ({
        id: alarm.id?.toString() || Date.now().toString(),
        imei: alarm.imei || '',
        type: WatchService.getAlarmTypeFromCode(alarm.alarm_type),
        status: 'active' as const, // Las alarmas del reloj están activas
        timestamp: alarm.timestamp || new Date().toISOString(),
        message: alarm.alarm_description || 'Alarma del reloj',
        priority: WatchService.getPriorityFromAlarmType(WatchService.getAlarmTypeFromCode(alarm.alarm_type)),
        location: alarm.latitude && alarm.longitude ? {
          latitude: alarm.latitude,
          longitude: alarm.longitude,
        } : undefined,
      })) : [];

      return alarms;

    } catch (error) {
      console.error('Error al obtener todos los eventos de alarma:', error);
      return [];
    }
  }

  /**
   * Obtiene los logs de comunicación del servidor
   * @param serverUrl URL del servidor
   * @returns Promise con los logs en texto plano
   */
  static async getCommunicationLogs(serverUrl?: string): Promise<string | null> {
    try {
      const url = serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const endpoint = `${url}/api/logs`;

      console.log('Solicitando logs de comunicación:', endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'text/plain',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const logs = await response.text();
      console.log('Logs de comunicación recibidos');

      return logs;

    } catch (error) {
      console.error('Error al obtener los logs de comunicación:', error);
      return null;
    }
  }

  /**
   * Envía un comando estructurado al reloj
   * @param command Comando a enviar
   * @param params Parámetros opcionales del comando
   * @param commandParams Parámetros de configuración (IMEI, servidor)
   * @returns Promise con la respuesta del comando
   */
  static async sendCommand(
    command: string, 
    params?: string | null, 
    commandParams?: Partial<CommandParams>
  ): Promise<CommandResponse> {
    try {
      // Construir la URL del endpoint
      const serverUrl = commandParams?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = commandParams?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/command`;

      console.log('Enviando comando al reloj:', { command, params, endpoint });

      // Crear el payload del comando
      const commandPayload: SendCommandRequest = {
        command,
        params: params || null,
      };

      // Crear un AbortController para manejar el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

      // Realizar la solicitud HTTP
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandPayload),
        signal: controller.signal,
      });

      // Limpiar el timeout si la respuesta es exitosa
      clearTimeout(timeoutId);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      // Parsear la respuesta JSON
      const data = await response.json();
      
      console.log('Comando enviado exitosamente:', data);
      
      return {
        success: true,
        message: 'Comando enviado exitosamente',
        data: data,
      };

    } catch (error) {
      console.error('Error al enviar comando al reloj:', error);
      
      let errorMessage = 'Error desconocido al enviar comando';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Timeout al enviar comando al reloj';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Error de red al enviar comando';
        } else if (error.message.includes('HTTP:')) {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Envía un comando raw (payload directo) al reloj
   * @param payload Payload raw a enviar
   * @param commandParams Parámetros de configuración (IMEI, servidor)
   * @returns Promise con la respuesta del comando
   */
  static async sendRawCommand(
    payload: string, 
    commandParams?: Partial<CommandParams>
  ): Promise<CommandResponse> {
    try {
      // Construir la URL del endpoint
      const serverUrl = commandParams?.serverUrl || API_CONFIG.WATCH_SERVER_URL;
      const imeiCode = commandParams?.imeiCode || API_CONFIG.WATCH_IMEI_CODE;
      const endpoint = `${serverUrl}/api/watches/${imeiCode}/raw`;

      console.log('Enviando comando raw al reloj:', { payload, endpoint });

      // Crear el payload del comando raw
      const commandPayload: RawCommandRequest = {
        payload:`BP33${imeiCode},080835,3#`,
      };

      // Crear un AbortController para manejar el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

      // Realizar la solicitud HTTP
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandPayload),
        signal: controller.signal,
      });

      // Limpiar el timeout si la respuesta es exitosa
      clearTimeout(timeoutId);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      // Parsear la respuesta JSON
      const data = await response.json();
      
      console.log('Comando raw enviado exitosamente:', data);
      
      return {
        success: true,
        message: 'Comando raw enviado exitosamente',
        data: data,
      };

    } catch (error) {
      console.error('Error al enviar comando raw al reloj:', error);
      
      let errorMessage = 'Error desconocido al enviar comando raw';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Timeout al enviar comando raw al reloj';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Error de red al enviar comando raw';
        } else if (error.message.includes('HTTP:')) {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
