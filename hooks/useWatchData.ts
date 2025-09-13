import { WatchService } from '@/services/watchService';
import { FallEvent, FallEventStats, WatchAlarm, WatchMetrics, WatchStatus } from '@/types/watch';
import { useCallback, useEffect, useState } from 'react';

// Hook para obtener métricas de salud del reloj
export function useWatchMetrics() {
  const [metrics, setMetrics] = useState<WatchMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WatchService.getWatchMetrics();
      setMetrics(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener métricas del reloj';
      setError(errorMessage);
      console.error('Error en useWatchMetrics:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
    
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh,
  };
}

// Hook para obtener el estado del reloj
export function useWatchStatus() {
  const [status, setStatus] = useState<WatchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WatchService.getWatchStatus();
      setStatus(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estado del reloj';
      setError(errorMessage);
      console.error('Error en useWatchStatus:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();
    
    // Actualizar estado cada 15 segundos
    const interval = setInterval(fetchStatus, 15000);
    
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refresh,
  };
}

// Hook para obtener eventos de caída
export function useWatchFallEvents() {
  const [fallEvents, setFallEvents] = useState<FallEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFallEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WatchService.getWatchFallEvents();
      setFallEvents(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener eventos de caída';
      setError(errorMessage);
      console.error('Error en useWatchFallEvents:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchFallEvents();
  }, [fetchFallEvents]);

  useEffect(() => {
    fetchFallEvents();
    
    // Actualizar eventos cada 2 minutos
    const interval = setInterval(fetchFallEvents, 120000);
    
    return () => clearInterval(interval);
  }, [fetchFallEvents]);

  return {
    fallEvents,
    loading,
    error,
    refresh,
  };
}

// Hook para obtener alarmas del reloj
export function useWatchAlarms() {
  const [alarms, setAlarms] = useState<WatchAlarm[]>([]);
  const [latestAlarm, setLatestAlarm] = useState<WatchAlarm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [alarmEvents, latest] = await Promise.all([
        WatchService.getWatchAlarmEvents(),
        WatchService.getWatchLatestAlarm(),
      ]);
      
      setAlarms(alarmEvents);
      setLatestAlarm(latest);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener alarmas del reloj';
      setError(errorMessage);
      console.error('Error en useWatchAlarms:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAlarms();
  }, [fetchAlarms]);

  useEffect(() => {
    fetchAlarms();
    
    // Actualizar alarmas cada minuto
    const interval = setInterval(fetchAlarms, 60000);
    
    return () => clearInterval(interval);
  }, [fetchAlarms]);

  return {
    alarms,
    latestAlarm,
    loading,
    error,
    refresh,
  };
}

// Hook para obtener estadísticas de eventos de caída
export function useFallEventStats() {
  const [stats, setStats] = useState<FallEventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WatchService.getFallEventStats();
      setStats(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas de eventos';
      setError(errorMessage);
      console.error('Error en useFallEventStats:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
    
    // Actualizar estadísticas cada 5 minutos
    const interval = setInterval(fetchStats, 300000);
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
