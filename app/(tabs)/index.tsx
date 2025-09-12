import { CommonStyles } from '@/components/CommonStyles';
import Header from '@/components/header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useHeartData } from '@/hooks/monitoring/heart';
import { useMaps } from '@/hooks/useMaps';
import { WatchService } from '@/services/watchService';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const tb = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const mapsData = useMaps();
  const { mapProvider, initialRegion, currentRegion, isLoading } = mapsData;
  const { heartRate } = useHeartData();

  const bottomGap=Platform.OS === 'ios' ? 16 : Math.max(Math.ceil(tb || 0), 64 + insets.bottom)+24;
  console.log('Heart rate:', heartRate);
  console.log('[tabs] tb=', tb, 'insets.bottom=', insets.bottom, 'bottomGap=', bottomGap);

  const safeHeartRate = typeof heartRate === 'number' ? heartRate : 0;
  const safeCurrentRegion =
    currentRegion &&
    typeof currentRegion === 'object' &&
    typeof currentRegion.latitude === 'number' &&
    typeof currentRegion.longitude === 'number'
      ? currentRegion
      : undefined;

  const [command, setCommand] = useState('');
  const [params, setParams] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const handleSendCommand = async () => {
    if (!command.trim()) {
      Alert.alert('Error', 'Por favor ingresa un comando');
      return;
    }
    setIsSending(true);
    setLastResponse(null);
    try {
      const response = await WatchService.sendCommand(command.trim(), params.trim() || null);
      setLastResponse(response.success ? 'Comando enviado exitosamente' : response.message || 'Error desconocido');
      if (response.success) {
        setCommand('');
        setParams('');
      }
    } catch (error) {
      setLastResponse('Error al enviar comando');
      console.error('Error sending command:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={[CommonStyles.container, { backgroundColor: '#fff', flex: 1 }]}>
    <ScrollView
    contentInsetAdjustmentBehavior="never"
    automaticallyAdjustContentInsets={false}
    contentContainerStyle={{
      paddingTop: insets.top + 20,
      paddingBottom: bottomGap,
    }}
    contentInset={{ top: 0, left: 0, right: 0, bottom: bottomGap }}
    scrollIndicatorInsets={{ top: insets.top, bottom: bottomGap }}
    >

        {/* Header */}
        <Header />

        {/* Dashboard Title */}
        <View style={styles.dashboardSection}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.dashboardSubtitleText}>Un resumen del estado de Elena</Text>
          <View style={styles.actionButtons}>
            <Pressable style={styles.viewReportButton}>
              <Text style={styles.viewReportText}>Ver Reporte</Text>
            </Pressable>
            <Pressable style={styles.sosButton}>
              <Text style={styles.sosText}>Llamada SOS</Text>
            </Pressable>
          </View>
        </View>

        {/* Monitor de Signos Vitales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monitor de Signos Vitales</Text>
          <View style={styles.vitalSignsGrid}>
            <View style={styles.vitalCard}>
              <IconSymbol name="heart.fill" size={24} color="#FF4444" />
              <Text style={styles.vitalLabel}>Ritmo Cardíaco</Text>
              <Text style={styles.vitalValue}>{safeHeartRate} bpm</Text>
            </View>
            <View style={styles.vitalCard}>
              <IconSymbol name="drop.fill" size={24} color="#4488FF" />
              <Text style={styles.vitalLabel}>Oxígeno</Text>
              <Text style={styles.vitalValue}>98%</Text>
            </View>
            <View style={styles.vitalCard}>
              <IconSymbol name="thermometer" size={24} color="#FF8844" />
              <Text style={styles.vitalLabel}>Temperatura</Text>
              <Text style={styles.vitalValue}>36.5°C</Text>
            </View>
            <View style={styles.vitalCard}>
              <IconSymbol name="checkmark.shield.fill" size={24} color="#44AA44" />
              <Text style={styles.vitalLabel}>Estado</Text>
              <Text style={styles.vitalValue}>Estable</Text>
            </View>
          </View>
        </View>

        {/* Resumen de Actividad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Actividad</Text>
          <View style={styles.activityCard}>
            <IconSymbol name="waveform" size={24} color="#000" />
            <Text style={styles.activityLabel}>Pasos hoy</Text>
            <Text style={styles.activityValue}>3,456</Text>
          </View>
        </View>

        {/* Comando al Reloj */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comando al Reloj</Text>
          <View style={styles.commandCard}>
            <TextInput
              style={styles.commandInput}
              placeholder="Ingresa un comando (ej: SOS, LOCATION, STATUS)"
              value={command}
              onChangeText={setCommand}
              editable={!isSending}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TextInput
              style={styles.commandInput}
              placeholder="Parámetros (opcional)"
              value={params}
              onChangeText={setParams}
              editable={!isSending}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
              onPress={handleSendCommand}
              disabled={isSending}
            >
              <Text style={[styles.sendButtonText, isSending && styles.sendButtonTextDisabled]}>
                {isSending ? 'Enviando...' : 'Enviar'}
              </Text>
            </Pressable>
          </View>
          {lastResponse && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>{lastResponse}</Text>
            </View>
          )}
        </View>

        {/* Ubicación Actual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación Actual</Text>
          <Pressable onPress={() => router.push('/ubicacion')} style={styles.viewMapButton}>
            <Text style={styles.viewMapLink}>Ver mapa completo</Text>
          </Pressable>

          {/* Estado de conexión GPS */}
          <View style={styles.gpsStatusContainer}>
            <IconSymbol
              name={mapsData.isConnected ? 'location.fill' : 'location.slash'}
              size={16}
              color={mapsData.isConnected ? '#44AA44' : '#FF4444'}
            />
            <Text
              style={[
                styles.gpsStatusText,
                { color: mapsData.isConnected ? '#44AA44' : '#FF4444' },
              ]}
            >
              {mapsData.isConnected ? 'GPS Conectado' : 'Sin señal GPS'}
            </Text>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={mapProvider}
              initialRegion={initialRegion}
              region={safeCurrentRegion}
              showsUserLocation
              showsMyLocationButton
              loadingEnabled={isLoading}
            />
          </View>
        </View>
        {Platform.OS !== 'ios' && <View style={{ height: bottomGap }} />} 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollView: { flex: 1 },
  dashboardSection: { paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' },
  dashboardTitle: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 8, textAlign: 'center' },
  dashboardSubtitleText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 },
  actionButtons: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  viewReportButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  viewReportText: { fontSize: 14, color: '#333', fontWeight: '500' },
  sosButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#000' },
  sosText: { fontSize: 14, color: '#fff', fontWeight: '500' },
  section: { paddingHorizontal: 20, marginBottom: 24, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16, textAlign: 'center' },
  vitalSignsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  vitalCard: {
    width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 1, minHeight: 100,
  },
  vitalLabel: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 4 },
  vitalValue: { fontSize: 20, fontWeight: '700', color: '#333' },
  activityCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  activityLabel: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
  activityValue: { fontSize: 24, fontWeight: '700', color: '#333' },
  viewMapButton: {
    marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f8f9fa',
    borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef',
  },
  viewMapLink: { fontSize: 14, color: '#007AFF', fontWeight: '500', textAlign: 'center' },
  gpsStatusContainer: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef',
  },
  gpsStatusText: { fontSize: 14, fontWeight: '500', marginLeft: 8 },
  mapContainer: {
    height: 200, width: '100%', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1, alignSelf: 'center',
  },
  map: { width: '100%', height: '100%' },
  commandCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1, width: '100%', alignSelf: 'center',
  },
  commandInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 12 },
  sendButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sendButtonTextDisabled: { color: '#999' },
  responseContainer: { marginTop: 12, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  responseText: { fontSize: 14, color: '#333', fontStyle: 'italic' },
});
