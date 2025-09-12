import { CommonColors, CommonStyles } from '@/components/CommonStyles';
import Header from '@/components/header';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMaps } from '@/hooks/useMaps';
import { useWatchLocation } from '@/hooks/useWatchLocation';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UbicacionScreen() {
  const { mapProvider, initialRegion, currentRegion, isLoading, error } = useMaps();
  const { location: watchLocation, isConnected } = useWatchLocation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={CommonStyles.container} edges={['left', 'right']}>
      <ScrollView 
        style={CommonStyles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 100 : 100,
        }}
      >
        {/* Header */}
        <Header />
        
        {/* Título de la sección */}
        <View style={CommonStyles.sectionHeader}>
          <IconSymbol name="location.fill" size={32} color={CommonColors.secondary} />
          <ThemedText type="title" style={CommonStyles.sectionTitle}>Ubicación del Reloj</ThemedText>
          <View style={CommonStyles.statusIndicator}>
            <IconSymbol
              name={isConnected ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"}
              size={16}
              color={isConnected ? CommonColors.success : CommonColors.error}
            />
            <ThemedText style={[CommonStyles.statusText, { color: isConnected ? CommonColors.success : CommonColors.error }]}>
              {isConnected ? "Conectado" : "Desconectado"}
            </ThemedText>
          </View>
        </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={mapProvider}
              initialRegion={initialRegion}
              region={currentRegion}
              showsUserLocation
              showsMyLocationButton
              loadingEnabled={isLoading}
            >
              {currentRegion && (
                <Marker
                  coordinate={{
                    latitude: currentRegion.latitude,
                    longitude: currentRegion.longitude,
                  }}
                  title="Ubicación del Reloj"
                  description="Ubicación actual del reloj"
                  pinColor="#4ECDC4"
                />
              )}
            </MapView>

            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ThemedText>Cargando ubicación...</ThemedText>
              </View>
            )}
          </View>

          <View style={CommonStyles.infoContainer}>
            <ThemedText type="subtitle" style={CommonStyles.subtitle}>
              Estado del Reloj
            </ThemedText>

            {error && (
              <View style={CommonStyles.errorContainer}>
                <ThemedText style={CommonStyles.errorText}>⚠️ {error}</ThemedText>
              </View>
            )}

            {watchLocation ? (
              <ThemedText style={CommonStyles.infoText}>
                📍 Ubicación: {watchLocation.latitude.toFixed(6)}, {watchLocation.longitude.toFixed(6)}
                {'\n'}🕐 Última actualización: {new Date(watchLocation.timestamp).toLocaleString()}
                {'\n'}🔋 Batería: {watchLocation.battery}%
                {'\n'}🛰️ Satélites: {watchLocation.satellites}
                {'\n'}📶 Señal GSM: {watchLocation.gsm_signal}%
                {'\n'}🚗 Velocidad: {watchLocation.speed_kmh.toFixed(2)} km/h
                {'\n'}🧭 Dirección: {watchLocation.direction_deg.toFixed(1)}°
              </ThemedText>
            ) : (
              <ThemedText style={CommonStyles.infoText}>
                No se ha podido obtener la ubicación del reloj
              </ThemedText>
            )}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Estilos específicos de ubicación que no están en CommonStyles
  mapContainer: {
    height: 500,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f2f2f2',
  },
  map: { 
    flex: 1 
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
});
