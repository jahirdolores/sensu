import { StyleSheet } from 'react-native';

/**
 * Estilos comunes compartidos entre todas las pantallas de tabs
 * Para mantener consistencia visual en toda la aplicación
 */
export const CommonStyles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
  },
  
  // ScrollView principal
  scrollView: {
    flex: 1,
    width: '100%',
  },
  
  // Header de sección (título con icono)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    paddingBottom: 10,
  },
  
  // Título de sección
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#000000',
  },
  
  // Tarjetas principales
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  
  // Contenedor de información
  infoContainer: {
    padding: 20,
    paddingTop: 10,
  },
  
  // Texto de información
  infoText: {
    opacity: 0.8,
    lineHeight: 20,
    color: '#000000',
  },
  
  // Subtítulo
  subtitle: {
    marginBottom: 8,
    color: '#000000',
  },
  
  // Contenedor de error
  errorContainer: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderColor: 'rgba(255,107,107,0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  
  // Texto de error
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Contenedor de carga
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  
  // Contenedor vacío
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  
  // Título de estado vacío
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#000000',
  },
  
  // Texto de estado vacío
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
    color: '#666',
  },
  
  // Botón de acción
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  
  // Texto de botón de acción
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Botón secundario
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  
  // Texto de botón secundario
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Badge/etiqueta
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  
  // Texto de badge
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Indicador de estado
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Texto de estado
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  
  // Contenedor de icono
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  // Texto de tiempo/fecha
  timeText: {
    fontSize: 12,
    opacity: 0.7,
    color: '#666',
  },
  
  // Texto secundario
  secondaryText: {
    fontSize: 12,
    opacity: 0.7,
    color: '#666',
  },
});

/**
 * Colores comunes de la aplicación
 */
export const CommonColors = {
  primary: '#007AFF',
  secondary: '#4ECDC4',
  success: '#44AA44',
  warning: '#FFA500',
  error: '#FF6B6B',
  critical: '#FF4444',
  text: '#000000',
  textSecondary: '#666',
  background: '#ffffff',
  cardBackground: '#fff',
  border: '#f0f0f0',
  shadow: '#000',
};

/**
 * Espaciado común
 */
export const CommonSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
