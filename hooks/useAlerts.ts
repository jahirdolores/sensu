import { WatchService } from '@/services/watchService';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Tipos para alertas
export interface AlertItem {
  id: string;
  type: 'medication' | 'appointment' | 'emergency' | 'activity' | 'general';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
  isActive: boolean;
}

export interface AlertSettings {
  medicationReminders: boolean;
  appointmentReminders: boolean;
  emergencyAlerts: boolean;
  activityAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface UseAlertsReturn {
  alerts: AlertItem[];
  settings: AlertSettings;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: (alertId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  createAlert: (alert: Omit<AlertItem, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  updateSettings: (settings: Partial<AlertSettings>) => Promise<void>;
}

/**
 * Hook personalizado para manejar alertas del sistema
 * Se alimenta de endpoints de alertas (simulado por ahora)
 */
export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    medicationReminders: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    activityAlerts: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener alertas reales del reloj
      const watchAlarms = await WatchService.getWatchAlarmEvents();
      
      // Convertir alertas del reloj a nuestro formato
      const realAlerts: AlertItem[] = watchAlarms.map((alarm, index) => ({
        id: alarm.id,
        type: alarm.type === 'sos' || alarm.type === 'fall' ? 'emergency' : 
              alarm.type === 'heart_rate' || alarm.type === 'temperature' ? 'general' : 'general',
        title: getAlarmTitle(alarm.type),
        message: alarm.message,
        priority: alarm.priority,
        isRead: alarm.status === 'acknowledged' || alarm.status === 'resolved',
        createdAt: alarm.timestamp,
        scheduledFor: undefined,
        isActive: alarm.status === 'active',
      }));
      
      // Agregar alertas simuladas adicionales si no hay alertas del reloj
      if (realAlerts.length === 0) {
        const mockAlerts: AlertItem[] = [
          {
            id: 'mock-1',
            type: 'medication',
            title: 'Recordatorio de Medicamento',
            message: 'Es hora de tomar tu medicamento para la presión arterial',
            priority: 'high',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            scheduledFor: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            isActive: true,
          },
          {
            id: 'mock-2',
            type: 'appointment',
            title: 'Cita Médica Próxima',
            message: 'Tienes una cita con el cardiólogo mañana a las 10:00 AM',
            priority: 'medium',
            isRead: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            scheduledFor: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
        ];
        
        setAlerts([...realAlerts, ...mockAlerts]);
      } else {
        setAlerts(realAlerts);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener alertas';
      setError(errorMessage);
      console.error('Error en useAlerts:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función auxiliar para obtener títulos de alertas
  const getAlarmTitle = (type: string): string => {
    switch (type) {
      case 'sos': return 'Alerta SOS';
      case 'fall': return 'Detección de Caída';
      case 'low_battery': return 'Batería Baja';
      case 'no_signal': return 'Reloj No Detectado';
      case 'geofence': return 'Alerta de Geocerca';
      case 'heart_rate': return 'Alerta de Frecuencia Cardíaca';
      case 'temperature': return 'Alerta de Temperatura';
      default: return 'Alerta del Reloj';
    }
  };

  const refresh = useCallback(async () => {
    await fetchAlerts();
  }, [fetchAlerts]);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar alerta como leída';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar todas las alertas como leídas';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const deleteAlert = useCallback(async (alertId: string) => {
    try {
      // Simular eliminación en API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar alerta';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const createAlert = useCallback(async (alert: Omit<AlertItem, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      // Simular creación en API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert: AlertItem = {
        ...alert,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear alerta';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<AlertSettings>) => {
    try {
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar configuración';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  useEffect(() => {
    fetchAlerts();
    
    // Actualizar alertas cada 2 minutos
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return {
    alerts,
    settings,
    loading,
    error,
    unreadCount,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    createAlert,
    updateSettings,
  };
}
