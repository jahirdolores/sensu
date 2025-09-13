import { WatchService } from '@/services/watchService';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Tipos para datos de salud
export interface HealthData {
  heartRate: number;
  steps: number;
  calories: number;
  sleepHours: number;
  lastUpdate: string;
}

export interface HealthMetrics {
  heartRate: {
    current: number;
    resting: number;
    max: number;
    zone: 'rest' | 'fat_burn' | 'cardio' | 'peak';
  };
  activity: {
    steps: number;
    stepsGoal: number;
    calories: number;
    caloriesGoal: number;
    distance: number;
  };
  sleep: {
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
  };
}

interface UseHealthDataReturn {
  healthData: HealthData | null;
  healthMetrics: HealthMetrics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateHeartRate: (rate: number) => Promise<void>;
  updateSteps: (steps: number) => Promise<void>;
}

/**
 * Hook personalizado para manejar datos de salud
 * Se alimenta de endpoints de salud (simulado por ahora)
 */
export function useHealthData(): UseHealthDataReturn {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener métricas reales del reloj
      const watchMetrics = await WatchService.getWatchMetrics();
      
      if (watchMetrics) {
        // Usar datos reales del reloj
        const realHealthData: HealthData = {
          heartRate: watchMetrics.heartRate?.current || 0,
          steps: watchMetrics.activity?.steps || 0,
          calories: watchMetrics.activity?.calories || 0,
          sleepHours: 7.5, // No disponible en el reloj, mantener valor por defecto
          lastUpdate: watchMetrics.lastUpdate,
        };
        
        const realHealthMetrics: HealthMetrics = {
          heartRate: {
            current: watchMetrics.heartRate?.current || 0,
            resting: watchMetrics.heartRate?.resting || 0,
            max: watchMetrics.heartRate?.max || 0,
            zone: watchMetrics.heartRate?.zone || 'rest',
          },
          activity: {
            steps: watchMetrics.activity?.steps || 0,
            stepsGoal: 10000, // Meta por defecto
            calories: watchMetrics.activity?.calories || 0,
            caloriesGoal: 500, // Meta por defecto
            distance: watchMetrics.activity?.distance || 0,
          },
          sleep: {
            hours: 7.5, // No disponible en el reloj
            quality: 'good',
            deepSleep: 2.1,
            lightSleep: 4.2,
            remSleep: 1.2,
          },
        };
        
        setHealthData(realHealthData);
        setHealthMetrics(realHealthMetrics);
      } else {
        // Fallback a datos simulados si no hay conexión
        const mockHealthData: HealthData = {
          heartRate: 72,
          steps: 6842,
          calories: 320,
          sleepHours: 7.5,
          lastUpdate: new Date().toISOString(),
        };
        
        const mockHealthMetrics: HealthMetrics = {
          heartRate: {
            current: 72,
            resting: 65,
            max: 190,
            zone: 'rest',
          },
          activity: {
            steps: 6842,
            stepsGoal: 10000,
            calories: 320,
            caloriesGoal: 500,
            distance: 5.2,
          },
          sleep: {
            hours: 7.5,
            quality: 'good',
            deepSleep: 2.1,
            lightSleep: 4.2,
            remSleep: 1.2,
          },
        };
        
        setHealthData(mockHealthData);
        setHealthMetrics(mockHealthMetrics);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener datos de salud';
      setError(errorMessage);
      console.error('Error en useHealthData:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchHealthData();
  }, [fetchHealthData]);

  const updateHeartRate = useCallback(async (rate: number) => {
    try {
      // Simular actualización de frecuencia cardíaca
      // En una implementación real, esto sería una llamada HTTP PUT/POST
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthData(prev => prev ? {
        ...prev,
        heartRate: rate,
        lastUpdate: new Date().toISOString(),
      } : null);
      
      setHealthMetrics(prev => prev ? {
        ...prev,
        heartRate: {
          ...prev.heartRate,
          current: rate,
        },
      } : null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar frecuencia cardíaca';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const updateSteps = useCallback(async (steps: number) => {
    try {
      // Simular actualización de pasos
      // En una implementación real, esto sería una llamada HTTP PUT/POST
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthData(prev => prev ? {
        ...prev,
        steps: steps,
        lastUpdate: new Date().toISOString(),
      } : null);
      
      setHealthMetrics(prev => prev ? {
        ...prev,
        activity: {
          ...prev.activity,
          steps: steps,
        },
      } : null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar pasos';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
    
    // Actualizar datos cada 5 minutos
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchHealthData]);

  return {
    healthData,
    healthMetrics,
    loading,
    error,
    refresh,
    updateHeartRate,
    updateSteps,
  };
}
