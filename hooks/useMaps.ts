import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { API_CONFIG } from '@/config/api';
import { useWatchLocation } from './useWatchLocation';

interface UseMapsReturn {
  mapProvider: typeof PROVIDER_GOOGLE | undefined;
  initialRegion: Region;
  currentRegion: Region | undefined;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  refreshLocation: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la configuración y estado del mapa
 * Combina la ubicación del reloj con la configuración del mapa
 */
export function useMaps(): UseMapsReturn {
  const { location: watchLocation, loading, error, refresh, isConnected } = useWatchLocation();
  const [currentRegion, setCurrentRegion] = useState<Region | undefined>(undefined);

  // Configuración del proveedor del mapa
  const mapProvider = Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE;

  // Región inicial por defecto
  const initialRegion: Region = {
    latitude: API_CONFIG.DEFAULT_LOCATION.latitude,
    longitude: API_CONFIG.DEFAULT_LOCATION.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Actualizar región cuando cambie la ubicación del reloj
  useEffect(() => {
    if (watchLocation) {
      const newRegion: Region = {
        latitude: watchLocation.latitude,
        longitude: watchLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setCurrentRegion(newRegion);
    } else {
      setCurrentRegion(undefined);
    }
  }, [watchLocation]);

  // Función para refrescar la ubicación
  const refreshLocation = async () => {
    await refresh();
  };

  return {
    mapProvider,
    initialRegion,
    currentRegion,
    isLoading: loading,
    error,
    isConnected,
    refreshLocation,
  };
}
