import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { API_CONFIG } from '@/config/api';
import { useWatchLocation } from '@/hooks/useWatchLocation';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const isIos = Platform.OS === 'ios';

export default function UbicacionScreen() {
  const { location: watchLocation, loading, error, refresh, isConnected } = useWatchLocation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="location.fill" size={32} color="#4ECDC4" />
          <ThemedText type="title" style={styles.title}>Ubicación del Reloj</ThemedText>
          <View style={styles.statusIndicator}>
            <IconSymbol 
              name={isConnected ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"} 
              size={16} 
              color={isConnected ? "#4ECDC4" : "#FF6B6B"} 
            />
            <ThemedText style={[styles.statusText, { color: isConnected ? "#4ECDC4" : "#FF6B6B" }]}>
              {isConnected ? "Conectado" : "Desconectado"}
            </ThemedText>
          </View>
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
          
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                ⚠️ {error}
              </ThemedText>
            </View>
          )}
          
          {watchLocation ? (
            <ThemedText style={styles.infoText}>
              📍 Ubicación: {watchLocation.latitude.toFixed(6)}, {watchLocation.longitude.toFixed(6)}
              {'\n'}🕐 Última actualización: {new Date(watchLocation.timestamp).toLocaleString()}
              {'\n'}🔋 Batería: {watchLocation.battery}%
              {'\n'}🛰️ Satélites: {watchLocation.satellites}
              {'\n'}📶 Señal GSM: {watchLocation.gsm_signal}%
              {'\n'}🚗 Velocidad: {watchLocation.speed_kmh.toFixed(2)} km/h
              {'\n'}🧭 Dirección: {watchLocation.direction_deg.toFixed(1)}°
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
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
  errorContainer: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderColor: 'rgba(255,107,107,0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
}); 