import { API_CONFIG, DEFAULT_HEADERS } from "@/config/api";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface OxygenMetrics {
  oxygenLevel: number;
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

export const useOxygenData = () => {
  const [oxygenData, setOxygenData] = useState<OxygenMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOxygenMetrics = async () => {
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
      
      console.log('Oxygen data received from API:', data);
      
      // Verificar si la API devuelve un objeto con estructura {value, received_at}
      let oxygenValue = 0;
      let timestampValue = new Date().toISOString();
      
      if (data && typeof data === 'object') {
        // Si tiene la estructura {value, received_at}
        if (data.value !== undefined && data.received_at !== undefined) {
          oxygenValue = typeof data.value === 'number' ? data.value : 0;
          timestampValue = data.received_at;
        } else {
          // Estructura tradicional
          oxygenValue = data.oxygenLevel || data.oxygen_level || data.spo2 || 0;
          timestampValue = data.timestamp || new Date().toISOString();
        }
      }
      
      setOxygenData({
        oxygenLevel: oxygenValue,
        timestamp: timestampValue,
        battery: data.battery,
        status: data.status
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // En caso de error, usar datos por defecto
      setOxygenData({
        oxygenLevel: 0,
        timestamp: new Date().toISOString(),
        status: 'Sin conexión'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOxygenMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchOxygenMetrics, API_CONFIG.UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  const oxygenLevel = oxygenData?.oxygenLevel || 0;
  const status = oxygenData?.status || 'Estable';

  return {
    oxygenLevel,
    loading,
    error,
    refresh: fetchOxygenMetrics,
    status
  }
}
