import { CommonColors, CommonStyles } from '@/components/CommonStyles';
import Header from '@/components/header';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAlerts } from '@/hooks/useAlerts';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AlertaScreen() {
  const { 
    alerts, 
    loading, 
    error, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteAlert 
  } = useAlerts();
  const insets = useSafeAreaInsets();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF4444';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA500';
      case 'low': return '#4ECDC4';
      default: return '#FF6B6B';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return 'pills.fill';
      case 'appointment': return 'calendar';
      case 'emergency': return 'exclamationmark.triangle.fill';
      case 'activity': return 'figure.walk';
      default: return 'bell.fill';
    }
  };

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
          <IconSymbol name="bell.fill" size={32} color={CommonColors.error} />
          <ThemedText type="title" style={CommonStyles.sectionTitle}>Alertas</ThemedText>
          {unreadCount > 0 && (
            <View style={CommonStyles.badge}>
              <ThemedText style={CommonStyles.badgeText}>{unreadCount}</ThemedText>
            </View>
          )}
        </View>
        
        {loading && (
          <View style={CommonStyles.loadingContainer}>
            <ThemedText>Cargando alertas...</ThemedText>
          </View>
        )}
        
        {error && (
          <View style={CommonStyles.errorContainer}>
            <ThemedText style={CommonStyles.errorText}>⚠️ {error}</ThemedText>
          </View>
        )}
        
        {!loading && alerts.length > 0 && (
          <Pressable style={CommonStyles.secondaryButton} onPress={markAllAsRead}>
            <ThemedText style={CommonStyles.secondaryButtonText}>Marcar todas como leídas</ThemedText>
          </Pressable>
        )}
        
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <View key={alert.id} style={[CommonStyles.card, !alert.isRead && styles.unreadAlert]}>
              <View style={styles.alertHeader}>
                <View style={CommonStyles.iconContainer}>
                  <IconSymbol 
                    name={getTypeIcon(alert.type)} 
                    size={20} 
                    color={getPriorityColor(alert.priority)} 
                  />
                </View>
                <View style={styles.alertInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.alertTitle}>
                    {alert.title}
                  </ThemedText>
                  <ThemedText style={CommonStyles.timeText}>
                    {new Date(alert.createdAt).toLocaleString()}
                  </ThemedText>
                </View>
                <View style={styles.alertActions}>
                  {!alert.isRead && (
                    <Pressable 
                      style={styles.markReadButton} 
                      onPress={() => markAsRead(alert.id)}
                    >
                      <IconSymbol name="checkmark.circle" size={16} color="#4ECDC4" />
                    </Pressable>
                  )}
                  <Pressable 
                    style={styles.deleteButton} 
                    onPress={() => deleteAlert(alert.id)}
                  >
                    <IconSymbol name="trash" size={16} color="#FF6B6B" />
                  </Pressable>
                </View>
              </View>
              <ThemedText style={CommonStyles.infoText}>
                {alert.message}
              </ThemedText>
              <View style={styles.alertFooter}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
                  <ThemedText style={styles.priorityText}>
                    {alert.priority.toUpperCase()}
                  </ThemedText>
                </View>
                {alert.scheduledFor && (
                  <ThemedText style={CommonStyles.secondaryText}>
                    Programado: {new Date(alert.scheduledFor).toLocaleString()}
                  </ThemedText>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={CommonStyles.emptyContainer}>
            <IconSymbol name="bell.slash" size={48} color="#999" />
            <ThemedText type="subtitle" style={CommonStyles.emptyTitle}>
              No hay alertas
            </ThemedText>
            <ThemedText style={CommonStyles.emptyText}>
              Las alertas importantes aparecerán aquí
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Estilos específicos de alertas que no están en CommonStyles
  unreadAlert: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255,107,107,0.05)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    marginBottom: 2,
    color: '#000000',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  markReadButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
