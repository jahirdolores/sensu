import { API_CONFIG, DEFAULT_HEADERS } from "@/config/api";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface TemperatureMetrics {
  temperature: number;
  timestamp: string;
  battery?: number;
  status?: string;
}

const styles = StyleSheet.create({
  vitalLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
})

export const useTemperatureData = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemperatureMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_CONFIG.WATCH_SERVER_URL}/api/watches/${API_CONFIG.WATCH_IMEI_CODE}/metrics`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('Temperature data received from API:', data);
      
      // Verificar si la API devuelve un objeto con estructura {value, received_at}
      let temperatureValue = 0;
      let timestampValue = new Date().toISOString();
      
      if (data && typeof data === 'object') {
        // Si tiene la estructura {value, received_at}
        if (data.value !== undefined && data.received_at !== undefined) {
          temperatureValue = typeof data.value === 'number' ? data.value : 0;
          timestampValue = data.received_at;
        } else {
          // Estructura tradicional
          temperatureValue = data.temperature || data.body_temperature || 0;
          timestampValue = data.timestamp || new Date().toISOString();
        }
      }
      
      setTemperatureData({
        temperature: temperatureValue,
        timestamp: timestampValue,
        battery: data.battery,
        status: data.status
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // En caso de error, usar datos por defecto
      setTemperatureData({
        temperature: 0,
        timestamp: new Date().toISOString(),
        status: 'Sin conexión'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemperatureMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchTemperatureMetrics, API_CONFIG.UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  const temperature = temperatureData?.temperature || 0;
  const status = temperatureData?.status || 'Estable';

  return {
    temperature,
    loading,
    error,
    refresh: fetchTemperatureMetrics,
    status
  }
}
