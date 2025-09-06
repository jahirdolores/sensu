import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProfile } from '@/hooks/useProfile';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function YoScreen() {
  const { 
    profile, 
    settings, 
    loading, 
    error, 
    updateProfile, 
    updateSettings 
  } = useProfile();

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Funcionalidad de edición próximamente disponible');
  };

  const handleSettings = () => {
    Alert.alert('Configuración', 'Panel de configuración próximamente disponible');
  };

  const handleMedicalHistory = () => {
    Alert.alert('Historial Médico', 'Historial médico próximamente disponible');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="person.fill" size={32} color="#9B59B6" />
          <ThemedText type="title" style={styles.title}>Mi Perfil</ThemedText>
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ThemedText>Cargando perfil...</ThemedText>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          </View>
        )}
        
        {profile && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Información Personal */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Información Personal
              </ThemedText>
              
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <IconSymbol name="person.circle.fill" size={60} color="#9B59B6" />
                  </View>
                  <View style={styles.profileInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.profileName}>
                      {profile.name}
                    </ThemedText>
                    <ThemedText style={styles.profileEmail}>
                      {profile.email}
                    </ThemedText>
                    {profile.phone && (
                      <ThemedText style={styles.profilePhone}>
                        {profile.phone}
                      </ThemedText>
                    )}
                  </View>
                </View>
                
                <Pressable style={styles.editButton} onPress={handleEditProfile}>
                  <IconSymbol name="pencil" size={16} color="#9B59B6" />
                  <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Información Médica */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Información Médica
              </ThemedText>
              
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <IconSymbol name="calendar" size={20} color="#9B59B6" />
                  <ThemedText style={styles.infoLabel}>Fecha de Nacimiento:</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'No especificada'}
                  </ThemedText>
                </View>
                
                <View style={styles.infoRow}>
                  <IconSymbol name="ruler" size={20} color="#9B59B6" />
                  <ThemedText style={styles.infoLabel}>Altura:</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {profile.height ? `${profile.height} cm` : 'No especificada'}
                  </ThemedText>
                </View>
                
                <View style={styles.infoRow}>
                  <IconSymbol name="scalemass" size={20} color="#9B59B6" />
                  <ThemedText style={styles.infoLabel}>Peso:</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {profile.weight ? `${profile.weight} kg` : 'No especificado'}
                  </ThemedText>
                </View>
                
                <View style={styles.infoRow}>
                  <IconSymbol name="drop.fill" size={20} color="#9B59B6" />
                  <ThemedText style={styles.infoLabel}>Tipo de Sangre:</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {profile.bloodType || 'No especificado'}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Contacto de Emergencia */}
            {profile.emergencyContact && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Contacto de Emergencia
                </ThemedText>
                
                <View style={styles.emergencyCard}>
                  <IconSymbol name="phone.fill" size={24} color="#FF6B6B" />
                  <View style={styles.emergencyInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.emergencyName}>
                      {profile.emergencyContact.name}
                    </ThemedText>
                    <ThemedText style={styles.emergencyPhone}>
                      {profile.emergencyContact.phone}
                    </ThemedText>
                    <ThemedText style={styles.emergencyRelation}>
                      {profile.emergencyContact.relationship}
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}

            {/* Condiciones Médicas */}
            {profile.medicalConditions && profile.medicalConditions.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Condiciones Médicas
                </ThemedText>
                
                <View style={styles.conditionsCard}>
                  {profile.medicalConditions.map((condition, index) => (
                    <View key={index} style={styles.conditionItem}>
                      <IconSymbol name="cross.fill" size={16} color="#FF6B6B" />
                      <ThemedText style={styles.conditionText}>{condition}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Medicamentos */}
            {profile.medications && profile.medications.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Medicamentos
                </ThemedText>
                
                <View style={styles.medicationsCard}>
                  {profile.medications.map((medication, index) => (
                    <View key={index} style={styles.medicationItem}>
                      <IconSymbol name="pills.fill" size={16} color="#4ECDC4" />
                      <ThemedText style={styles.medicationText}>{medication}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Acciones */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Acciones
              </ThemedText>
              
              <View style={styles.actionsContainer}>
                <Pressable style={styles.actionButton} onPress={handleMedicalHistory}>
                  <IconSymbol name="doc.text.fill" size={20} color="#9B59B6" />
                  <ThemedText style={styles.actionButtonText}>Historial Médico</ThemedText>
                </Pressable>
                
                <Pressable style={styles.actionButton} onPress={handleSettings}>
                  <IconSymbol name="gear" size={20} color="#9B59B6" />
                  <ThemedText style={styles.actionButtonText}>Configuración</ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderColor: 'rgba(255,107,107,0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#9B59B6',
  },
  profileCard: {
    backgroundColor: 'rgba(155,89,182,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.2)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    opacity: 0.8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(155,89,182,0.1)',
  },
  editButtonText: {
    fontSize: 14,
    color: '#9B59B6',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: 'rgba(255,107,107,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    marginBottom: 4,
  },
  emergencyPhone: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  emergencyRelation: {
    fontSize: 12,
    opacity: 0.7,
  },
  conditionsCard: {
    backgroundColor: 'rgba(255,107,107,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  conditionText: {
    fontSize: 14,
  },
  medicationsCard: {
    backgroundColor: 'rgba(78,205,196,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(78,205,196,0.2)',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  medicationText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(155,89,182,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9B59B6',
  },
});
