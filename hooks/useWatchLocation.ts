import { API_CONFIG } from '@/config/api';
import { WatchService } from '@/services/watchService';
import { WatchLocation, WatchLocationParams } from '@/types/watch';
import { useCallback, useEffect, useState } from 'react';

interface UseWatchLocationReturn {
  location: WatchLocation | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isConnected: boolean;
}

/**
 * Hook personalizado para manejar la ubicación del reloj
 * Se alimenta del endpoint de ubicación del reloj
 */
export function useWatchLocation(params?: Partial<WatchLocationParams>): UseWatchLocationReturn {
  const [location, setLocation] = useState<WatchLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar conectividad del servidor primero
      const serverHealthy = await WatchService.checkServerHealth(params?.serverUrl);
      setIsConnected(serverHealthy);
      
      if (!serverHealthy) {
        console.warn('Servidor del reloj no disponible, usando ubicación por defecto');
        // No lanzar error, usar ubicación por defecto
        const defaultLocation: WatchLocation = {
          latitude: API_CONFIG.DEFAULT_LOCATION.latitude,
          longitude: API_CONFIG.DEFAULT_LOCATION.longitude,
          timestamp: new Date().toISOString(),
          battery: 0,
          satellites: 0,
          gsm_signal: 0,
          speed_kmh: 0,
          direction_deg: 0,
        };
        setLocation(defaultLocation);
        setIsConnected(false);
        setError('Servidor del reloj no disponible. Mostrando ubicación por defecto.');
        return;
      }
      
      // Obtener la ubicación del reloj
      const watchLocation = await WatchService.getWatchLocation(params);
      
      if (watchLocation) {
        setLocation(watchLocation);
        setIsConnected(true);
      } else {
        // Si no se pudo obtener la ubicación, usar ubicación por defecto
        const defaultLocation: WatchLocation = {
          latitude: API_CONFIG.DEFAULT_LOCATION.latitude,
          longitude: API_CONFIG.DEFAULT_LOCATION.longitude,
          timestamp: new Date().toISOString(),
          battery: 0,
          satellites: 0,
          gsm_signal: 0,
          speed_kmh: 0,
          direction_deg: 0,
        };
        setLocation(defaultLocation);
        setIsConnected(false);
        setError('No se pudo obtener la ubicación del reloj. Mostrando ubicación por defecto.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setIsConnected(false);
      
      // Usar ubicación por defecto en caso de error
      const defaultLocation: WatchLocation = {
        latitude: API_CONFIG.DEFAULT_LOCATION.latitude,
        longitude: API_CONFIG.DEFAULT_LOCATION.longitude,
        timestamp: new Date().toISOString(),
        battery: 0,
        satellites: 0,
        gsm_signal: 0,
        speed_kmh: 0,
        direction_deg: 0,
      };
      setLocation(defaultLocation);
      
      // Mostrar mensaje más específico según el tipo de error
      if (errorMessage.includes('Sin señal GPS')) {
        console.warn('El reloj no tiene señal GPS - ubicación no disponible');
      } else if (errorMessage.includes('Network request failed')) {
        console.warn('Error de red - verificar conectividad');
      } else {
        console.error('Error en useWatchLocation:', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [params]);

  const refresh = useCallback(async () => {
    await fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    fetchLocation();
    
    // Configurar actualización automática
    const interval = setInterval(fetchLocation, API_CONFIG.UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchLocation]);

  return {
    location,
    loading,
    error,
    refresh,
    isConnected,
  };
}
