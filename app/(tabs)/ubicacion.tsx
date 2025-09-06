import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { API_CONFIG, DEFAULT_HEADERS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const isIos = Platform.OS === 'ios';

interface WatchLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function UbicacionScreen() {
  const [watchLocation, setWatchLocation] = useState<WatchLocation | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener las coordenadas del reloj desde la API
  const fetchWatchLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_CONFIG.WATCH_LOCATION_API, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      });

      if (!response.ok) {
        throw new Error('Error al obtener la ubicación del reloj');
      }

      const data = await response.json();
      setWatchLocation({
        latitude: 19.184843,  //data.latitude,
        longitude: -99.586585, //data.longitude,
        timestamp: new Date().toISOString(), //data.timestamp,
      });
    } catch (error) {
      console.error('Error fetching watch location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación del reloj');
      // Ubicación por defecto
      setWatchLocation({
        latitude: 19.184843, //API_CONFIG.DEFAULT_LOCATION.latitude,
        longitude: -99.586585, //API_CONFIG.DEFAULT_LOCATION.longitude,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchLocation();
    
    // Actualizar la ubicación según el intervalo configurado
    const interval = setInterval(fetchWatchLocation, API_CONFIG.UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="location.fill" size={32} color="#4ECDC4" />
          <ThemedText type="title" style={styles.title}>Ubicación del Reloj</ThemedText>
        </View>
        
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={isIos ? undefined : PROVIDER_GOOGLE}
            initialRegion={{
              latitude: watchLocation?.latitude || API_CONFIG.DEFAULT_LOCATION.latitude,
              longitude: watchLocation?.longitude || API_CONFIG.DEFAULT_LOCATION.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={watchLocation ? {
              latitude: watchLocation.latitude,
              longitude: watchLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            } : undefined}
          >
            {watchLocation && (
              <Marker
                coordinate={{
                  latitude: watchLocation.latitude,
                  longitude: watchLocation.longitude,
                }}
                title="Ubicación del Reloj"
                description={`Última actualización: ${new Date(watchLocation.timestamp).toLocaleString()}`}
                pinColor="#4ECDC4"
              />
            )}
          </MapView>
          
          {loading && (
            <View style={styles.loadingOverlay}>
              <ThemedText>Cargando ubicación...</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Estado del Reloj
          </ThemedText>
          {watchLocation ? (
            <ThemedText style={styles.infoText}>
              📍 Ubicación: {watchLocation.latitude.toFixed(6)}, {watchLocation.longitude.toFixed(6)}
              {'\n'}🕐 Última actualización: {new Date(watchLocation.timestamp).toLocaleString()}
            </ThemedText>
          ) : (
            <ThemedText style={styles.infoText}>
              No se ha podido obtener la ubicación del reloj
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
    paddingTop: 10,
  },
  subtitle: {
    marginBottom: 8,
  },
  infoText: {
    opacity: 0.8,
    lineHeight: 20,
  },
}); 