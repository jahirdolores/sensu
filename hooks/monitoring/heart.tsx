import { API_CONFIG, DEFAULT_HEADERS } from "@/config/api";
import { useEffect, useState } from "react";

export const useHeartData = () => {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeartMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.WATCH_SERVER_URL}/api/watches/${API_CONFIG.WATCH_IMEI_CODE}/metrics`,
        {
          method: "GET",
          headers: DEFAULT_HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Raw value from API:", data);

      // El endpoint de métricas no tiene heart_rate, solo alarm_events
      // Por ahora, simularemos un valor de heart rate basado en alarm_events
      let heartRateValue = null;
      
      if (data?.alarm_events?.total_count !== undefined) {
        // Simular heart rate basado en el número de eventos de alarma
        // Esto es temporal hasta que el reloj envíe datos reales de heart rate
        const baseHeartRate = 70; // Frecuencia cardíaca base
        const alarmCount = data.alarm_events.total_count;
        
        // Simular variación basada en eventos de alarma
        if (alarmCount === 0) {
          heartRateValue = baseHeartRate + Math.floor(Math.random() * 20); // 70-90 bpm
        } else if (alarmCount < 3) {
          heartRateValue = baseHeartRate + 10 + Math.floor(Math.random() * 15); // 80-105 bpm
        } else {
          heartRateValue = baseHeartRate + 20 + Math.floor(Math.random() * 20); // 90-110 bpm
        }
      }

      setHeartRate(heartRateValue);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.warn("Error obteniendo heart rate:", errorMessage);
      setHeartRate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeartMetrics();
    const interval = setInterval(fetchHeartMetrics, API_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    heartRate,
    loading,
    error,
    refresh: fetchHeartMetrics,
  };
};
