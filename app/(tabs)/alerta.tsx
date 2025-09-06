import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertaScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="bell.fill" size={32} color="#FF6B6B" />
          <ThemedText type="title" style={styles.title}>Alertas</ThemedText>
        </View>
        
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Sistema de Alertas de Salud
          </ThemedText>
          
          <ThemedText style={styles.description}>
            Aquí podrás configurar y recibir alertas importantes sobre tu salud y bienestar.
          </ThemedText>
          
          <View style={styles.placeholderCard}>
            <ThemedText type="defaultSemiBold">Funcionalidades próximas:</ThemedText>
            <ThemedText style={{ opacity: 0.7, marginTop: 8 }}>
              • Alertas de medicamentos{'\n'}
              • Recordatorios de citas{'\n'}
              • Notificaciones de emergencia{'\n'}
              • Alertas de actividad física
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
    borderColor: 'rgba(255,107,107,0.2)',
    backgroundColor: 'rgba(255,107,107,0.05)',
  },
});
