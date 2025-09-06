/**
 * Ejemplo de uso del API del reloj
 * Este archivo muestra diferentes formas de usar el WatchService
 */

import { WatchService } from '@/services/watchService';
import { WatchLocation } from '@/types/watch';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WatchApiUsageExample() {
  const [location, setLocation] = useState<WatchLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverHealth, setServerHealth] = useState<boolean | null>(null);

  // Ejemplo 1: Obtener ubicación básica
  const fetchBasicLocation = async () => {
    setLoading(true);
    try {
      const result = await WatchService.getWatchLocation();
      if (result) {
        setLocation(result);
        Alert.alert('Éxito', 'Ubicación obtenida correctamente');
      } else {
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la ubicación');
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 2: Obtener ubicación con parámetros personalizados
  const fetchCustomLocation = async () => {
    setLoading(true);
    try {
      const result = await WatchService.getWatchLocation({
        serverUrl: 'http://mi-servidor-personalizado:8000',
        imeiCode: 'MI_IMEI_PERSONALIZADO'
      });
      
      if (result) {
        setLocation(result);
        Alert.alert('Éxito', 'Ubicación personalizada obtenida');
      } else {
        Alert.alert('Error', 'No se pudo obtener la ubicación personalizada');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la ubicación personalizada');
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 3: Verificar estado del servidor
  const checkServerHealth = async () => {
    try {
      const isHealthy = await WatchService.checkServerHealth();
      setServerHealth(isHealthy);
      
      if (isHealthy) {
        Alert.alert('Estado del Servidor', 'El servidor está funcionando correctamente');
      } else {
        Alert.alert('Estado del Servidor', 'El servidor no está disponible');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar el estado del servidor');
    }
  };

  // Ejemplo 4: Actualización automática cada 30 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await WatchService.getWatchLocation();
      if (result) {
        setLocation(result);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplos de Uso del API del Reloj</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={fetchBasicLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : 'Obtener Ubicación Básica'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={fetchCustomLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cargando...' : 'Ubicación Personalizada'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={checkServerHealth}
        >
          <Text style={styles.buttonText}>Verificar Servidor</Text>
        </TouchableOpacity>
      </View>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.infoTitle}>Información de Ubicación:</Text>
          <Text>📍 Lat: {location.latitude.toFixed(6)}</Text>
          <Text>📍 Lng: {location.longitude.toFixed(6)}</Text>
          <Text>🔋 Batería: {location.battery}%</Text>
          <Text>🛰️ Satélites: {location.satellites}</Text>
          <Text>📶 Señal GSM: {location.gsm_signal}%</Text>
          <Text>🚗 Velocidad: {location.speed_kmh.toFixed(2)} km/h</Text>
          <Text>🧭 Dirección: {location.direction_deg.toFixed(1)}°</Text>
          <Text>🕐 Actualizado: {new Date(location.timestamp).toLocaleString()}</Text>
        </View>
      )}

      {serverHealth !== null && (
        <View style={styles.serverInfo}>
          <Text style={styles.infoTitle}>Estado del Servidor:</Text>
          <Text style={serverHealth ? styles.healthy : styles.unhealthy}>
            {serverHealth ? '✅ Saludable' : '❌ No disponible'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  serverInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  healthy: {
    color: 'green',
    fontWeight: 'bold',
  },
  unhealthy: {
    color: 'red',
    fontWeight: 'bold',
  },
});
