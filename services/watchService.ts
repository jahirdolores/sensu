import { API_CONFIG, DEFAULT_HEADERS } from '@/config/api';
import { WatchLocation, WatchLocationParams, WatchLocationResponse } from '@/types/watch';

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
      const data: WatchLocationResponse = await response.json();
      
      // Validar que los datos sean válidos
      if (!data.parsed || !data.parsed.valid) {
        throw new Error('Los datos de ubicación no son válidos');
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
      
      const response = await fetch(`${url}/health`, {
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
}
