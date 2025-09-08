import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMaps } from '@/hooks/useMaps';

export default function HomeScreen() {
  const { mapProvider, initialRegion, currentRegion, isLoading } = useMaps();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
            <IconSymbol name="square.stack.3d.up.fill" size={22} color="black" />
            </View>
            <Text style={styles.logoText}>Sensu</Text>
          </View>
          <View style={styles.headerRight}>
            <Image 
              source={require('@/assets/images/relaxhome.jpg')} 
              style={styles.profileImage}
            />
            <Pressable style={styles.logoutButton}>
              <IconSymbol name="exit-outline" size={20} color="#666" />
            </Pressable>
          </View>
        </View>

        {/* Dashboard Title */}
        <View style={styles.dashboardSection}>
          <Text style={styles.dashboardTitle}>Menu</Text>
          <View style={styles.dashboardSubtitle}>
            <Text style={styles.dashboardSubtitleText}>Un resumen del estado de Elena.</Text>
            <View style={styles.actionButtons}>
              <Pressable style={styles.viewReportButton}>
                <Text style={styles.viewReportText}>Ver Reporte</Text>
              </Pressable>
              <Pressable style={styles.sosButton}>
                <Text style={styles.sosText}>Llamada SOS</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Monitor de Signos Vitales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monitor de Signos Vitales</Text>
          <View style={styles.vitalSignsGrid}>
            <View style={styles.vitalCard}>
              <IconSymbol name="heart.fill" size={24} color="#FF4444" />
              <Text style={styles.vitalLabel}>Ritmo Cardíaco</Text>
              <Text style={styles.vitalValue}>78 bpm</Text>
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

        {/* Ubicación Actual */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Ubicación Actual</Text>
            <Pressable onPress={() => router.push('/ubicacion')}>
              <Text style={styles.viewMapLink}>Ver mapa</Text>
            </Pressable>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={mapProvider}
              initialRegion={initialRegion}
              region={currentRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
              loadingEnabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  logoLine: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  logoLineOffset: {
    marginLeft: 2,
  },
  logoLineOffset2: {
    marginLeft: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoutButton: {
    padding: 4,
  },
  dashboardSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  dashboardSubtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dashboardSubtitleText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewReportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  viewReportText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sosButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  sosText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  vitalSignsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  activityLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  activityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewMapLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    position: 'relative',
  },
  mapPreview: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  callButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
