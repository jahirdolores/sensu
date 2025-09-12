import { API_CONFIG, DEFAULT_HEADERS } from '@/config/api';
import {
  CommandParams,
  CommandResponse,
  RawCommandRequest,
  SendCommandRequest,
  WatchLocation,
  WatchLocationParams
} from '@/types/watch';

/**
 * Servicio para manejar las solicitudes HTTP al API del reloj
 */
export class WatchService {
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
      const imeiCode = API_CONFIG.WATCH_IMEI_CODE;
      
      // Crear un AbortController para manejar el timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos
      
      // Usar el endpoint de ubicación para verificar si el servidor está disponible
      const response = await fetch(`${url}/api/watches/${imeiCode}/location`, {
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
