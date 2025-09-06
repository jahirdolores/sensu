import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAlerts } from '@/hooks/useAlerts';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="bell.fill" size={32} color="#FF6B6B" />
          <ThemedText type="title" style={styles.title}>Alertas</ThemedText>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
            </View>
          )}
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ThemedText>Cargando alertas...</ThemedText>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          </View>
        )}
        
        {!loading && alerts.length > 0 && (
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={markAllAsRead}>
              <ThemedText style={styles.actionButtonText}>Marcar todas como leídas</ThemedText>
            </Pressable>
          </View>
        )}
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, !alert.isRead && styles.unreadAlert]}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIconContainer}>
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
                    <ThemedText style={styles.alertTime}>
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
                <ThemedText style={styles.alertMessage}>
                  {alert.message}
                </ThemedText>
                <View style={styles.alertFooter}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
                    <ThemedText style={styles.priorityText}>
                      {alert.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                  {alert.scheduledFor && (
                    <ThemedText style={styles.scheduledText}>
                      Programado: {new Date(alert.scheduledFor).toLocaleString()}
                    </ThemedText>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <IconSymbol name="bell.slash" size={48} color="#999" />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No hay alertas
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Las alertas importantes aparecerán aquí
              </ThemedText>
            </View>
          )}
        </ScrollView>
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
    flex: 1,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
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
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  unreadAlert: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255,107,107,0.05)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    opacity: 0.7,
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
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
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
  scheduledText: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
