import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function YoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="person.fill" size={32} color="#9B59B6" />
          <ThemedText type="title" style={styles.title}>Mi Perfil</ThemedText>
        </View>
        
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Información Personal
          </ThemedText>
          
          <ThemedText style={styles.description}>
            Gestiona tu perfil, configuración y datos de salud personales.
          </ThemedText>
          
          <View style={styles.placeholderCard}>
            <ThemedText type="defaultSemiBold">Funcionalidades próximas:</ThemedText>
            <ThemedText style={{ opacity: 0.7, marginTop: 8 }}>
              • Perfil de usuario{'\n'}
              • Historial médico{'\n'}
              • Configuración de privacidad{'\n'}
              • Preferencias de notificaciones
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 24,
    opacity: 0.8,
    lineHeight: 20,
  },
  placeholderCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.2)',
    backgroundColor: 'rgba(155,89,182,0.05)',
  },
});
