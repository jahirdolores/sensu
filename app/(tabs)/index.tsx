import { CommonStyles } from '@/components/CommonStyles';
import Header from '@/components/header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useHeartData } from '@/hooks/monitoring/heart';
import { useMaps } from '@/hooks/useMaps';
import { useFallEventStats, useWatchFallEvents, useWatchMetrics, useWatchStatus } from '@/hooks/useWatchData';
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
  const { metrics: watchMetrics, loading: metricsLoading } = useWatchMetrics();
  const { status: watchStatus, loading: statusLoading } = useWatchStatus();
  const { fallEvents, loading: fallLoading } = useWatchFallEvents();
  const { stats, loading: statsLoading } = useFallEventStats();

  const bottomGap=Platform.OS === 'ios' ? 16 : Math.max(Math.ceil(tb || 0), 64 + insets.bottom)+24;
  console.log('Heart rate:', heartRate);
  console.log('[tabs] tb=', tb, 'insets.bottom=', insets.bottom, 'bottomGap=', bottomGap);

  const safeHeartRate = typeof heartRate === 'number' ? heartRate : (watchMetrics?.heartRate?.current || 0);
  const safeCurrentRegion =
    currentRegion &&
    typeof currentRegion === 'object' &&
    typeof currentRegion.latitude === 'number' &&
    typeof currentRegion.longitude === 'number'
      ? currentRegion
      : undefined;

  // Datos del reloj para mostrar
  const oxygenLevel = watchMetrics?.oxygen?.saturation || 98;
  const temperature = watchMetrics?.temperature?.body || 36.5;
  const batteryLevel = watchMetrics?.battery?.level || watchStatus?.battery || 0;
  const steps = watchMetrics?.activity?.steps || 3456;

  const [command, setCommand] = useState('');
  const [params, setParams] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  // Funciones auxiliares para métricas de salud
  const getHeartRateZone = (zone: string) => {
    switch (zone) {
      case 'rest': return 'Descanso';
      case 'fat_burn': return 'Quema de Grasa';
      case 'cardio': return 'Cardio';
      case 'peak': return 'Pico';
      default: return 'Desconocido';
    }
  };

  const getHeartRateZoneColor = (zone: string) => {
    switch (zone) {
      case 'rest': return '#4ECDC4';
      case 'fat_burn': return '#45B7D1';
      case 'cardio': return '#96CEB4';
      case 'peak': return '#FFEAA7';
      default: return '#DDA0DD';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4ECDC4';
      case 'medium': return '#FFA500';
      case 'high': return '#FF6B6B';
      case 'critical': return '#FF4444';
      default: return '#999';
    }
  };

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
              <Text style={styles.vitalValue}>{oxygenLevel}%</Text>
            </View>
            <View style={styles.vitalCard}>
              <IconSymbol name="thermometer" size={24} color="#FF8844" />
              <Text style={styles.vitalLabel}>Temperatura</Text>
              <Text style={styles.vitalValue}>{temperature}°C</Text>
            </View>
            <View style={styles.vitalCard}>
              <IconSymbol name="battery.100" size={24} color="#44AA44" />
              <Text style={styles.vitalLabel}>Batería</Text>
              <Text style={styles.vitalValue}>{batteryLevel}%</Text>
            </View>
          </View>
        </View>

        {/* Resumen de Actividad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Actividad</Text>
          <View style={styles.activityCard}>
            <IconSymbol name="waveform" size={24} color="#000" />
            <Text style={styles.activityLabel}>Pasos hoy</Text>
            <Text style={styles.activityValue}>{steps.toLocaleString()}</Text>
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

        {/* Métricas Detalladas de Salud */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Detalladas de Salud</Text>
          
          {/* Estado de Conexión del Reloj */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <IconSymbol 
                name={watchStatus?.online ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                size={20} 
                color={watchStatus?.online ? '#44AA44' : '#FF4444'} 
              />
              <Text style={styles.statusTitle}>
                Estado del Reloj
              </Text>
            </View>
            <Text style={styles.statusText}>
              {watchStatus?.online ? 'Conectado' : 'Desconectado'}
              {'\n'}Última conexión: {watchStatus?.lastSeen ? new Date(watchStatus.lastSeen).toLocaleString() : 'Desconocido'}
              {'\n'}Batería: {watchStatus?.battery || 0}%
              {'\n'}Señal GSM: {watchStatus?.gsm_signal || 0}%
              {'\n'}Satélites: {watchStatus?.satellites || 0}
            </Text>
          </View>

          {/* Métricas de Frecuencia Cardíaca Detalladas */}
          {watchMetrics?.heartRate && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="heart.fill" size={24} color="#FF4444" />
                <Text style={styles.metricTitle}>
                  Frecuencia Cardíaca Detallada
                </Text>
              </View>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Actual</Text>
                  <Text style={styles.metricValue}>{watchMetrics.heartRate.current} bpm</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>En Reposo</Text>
                  <Text style={styles.metricValue}>{watchMetrics.heartRate.resting} bpm</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Máxima</Text>
                  <Text style={styles.metricValue}>{watchMetrics.heartRate.max} bpm</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Zona</Text>
                  <View style={[styles.zoneBadge, { backgroundColor: getHeartRateZoneColor(watchMetrics.heartRate.zone) }]}>
                    <Text style={styles.zoneText}>
                      {getHeartRateZone(watchMetrics.heartRate.zone)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.timeText}>
                Última actualización: {new Date(watchMetrics.heartRate.timestamp).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Métricas de Oxígeno Detalladas */}
          {watchMetrics?.oxygen && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="drop.fill" size={24} color="#4488FF" />
                <Text style={styles.metricTitle}>
                  Saturación de Oxígeno Detallada
                </Text>
              </View>
              
              <View style={styles.oxygenContainer}>
                <Text style={styles.oxygenValue}>{watchMetrics.oxygen.saturation}%</Text>
                <Text style={styles.oxygenStatus}>
                  {watchMetrics.oxygen.saturation >= 95 ? 'Normal' : 
                   watchMetrics.oxygen.saturation >= 90 ? 'Leve hipoxemia' : 'Hipoxemia severa'}
                </Text>
              </View>
              
              <Text style={styles.timeText}>
                Última actualización: {new Date(watchMetrics.oxygen.timestamp).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Métricas de Temperatura Detalladas */}
          {watchMetrics?.temperature && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="thermometer" size={24} color="#FF8844" />
                <Text style={styles.metricTitle}>
                  Temperatura Detallada
                </Text>
              </View>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Corporal</Text>
                  <Text style={styles.metricValue}>{watchMetrics.temperature.body}°C</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Ambiental</Text>
                  <Text style={styles.metricValue}>{watchMetrics.temperature.ambient}°C</Text>
                </View>
              </View>
              
              <Text style={styles.timeText}>
                Última actualización: {new Date(watchMetrics.temperature.timestamp).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Métricas de Actividad Detalladas */}
          {watchMetrics?.activity && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="figure.walk" size={24} color="#4ECDC4" />
                <Text style={styles.metricTitle}>
                  Actividad Detallada
                </Text>
              </View>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Pasos</Text>
                  <Text style={styles.metricValue}>{watchMetrics.activity.steps.toLocaleString()}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Calorías</Text>
                  <Text style={styles.metricValue}>{watchMetrics.activity.calories}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Distancia</Text>
                  <Text style={styles.metricValue}>{watchMetrics.activity.distance.toFixed(2)} km</Text>
                </View>
              </View>
              
              <Text style={styles.timeText}>
                Última actualización: {new Date(watchMetrics.activity.timestamp).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Estadísticas de Eventos de Caída */}
          {stats && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#FF6B6B" />
                <Text style={styles.metricTitle}>
                  Estadísticas de Caídas
                </Text>
              </View>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Total</Text>
                  <Text style={styles.metricValue}>{stats.total}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Hoy</Text>
                  <Text style={styles.metricValue}>{stats.today}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Esta Semana</Text>
                  <Text style={styles.metricValue}>{stats.thisWeek}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Este Mes</Text>
                  <Text style={styles.metricValue}>{stats.thisMonth}</Text>
                </View>
              </View>
              
              <View style={styles.severityContainer}>
                <Text style={styles.severityTitle}>Por Severidad:</Text>
                <View style={styles.severityGrid}>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor('low') }]}>
                    <Text style={styles.severityText}>Baja: {stats.bySeverity.low}</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor('medium') }]}>
                    <Text style={styles.severityText}>Media: {stats.bySeverity.medium}</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor('high') }]}>
                    <Text style={styles.severityText}>Alta: {stats.bySeverity.high}</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor('critical') }]}>
                    <Text style={styles.severityText}>Crítica: {stats.bySeverity.critical}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Eventos de Caída Recientes */}
          {fallEvents.length > 0 && (
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="exclamationmark.triangle" size={24} color="#FF6B6B" />
                <Text style={styles.metricTitle}>
                  Eventos de Caída Recientes
                </Text>
              </View>
              
              {fallEvents.slice(0, 3).map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventHeader}>
                    <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(event.severity) }]} />
                    <Text style={styles.eventTitle}>
                      Caída {event.severity.toUpperCase()}
                    </Text>
                    <Text style={styles.timeText}>
                      {new Date(event.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.eventDetails}>
                    Estado: {event.status}
                    {'\n'}Batería: {event.battery}%
                    {'\n'}Señal GSM: {event.gsm_signal}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Estados de Carga */}
          {(metricsLoading || statusLoading || fallLoading || statsLoading) && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando métricas...</Text>
            </View>
          )}
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
  // Estilos para métricas detalladas
  statusCard: {
    backgroundColor: 'rgba(78,205,196,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(78,205,196,0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  oxygenContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  oxygenValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4488FF',
    marginBottom: 8,
  },
  oxygenStatus: {
    fontSize: 14,
    color: '#666',
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  severityContainer: {
    marginTop: 12,
  },
  severityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  severityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  eventDetails: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});
