# Guía de Integración con la API de GPS Watch

## Resumen

Esta aplicación React Native ahora está completamente integrada con tu API de GPS Watch en `http://192.168.1.65:8000`. La integración incluye todos los endpoints disponibles y muestra datos reales en las pantallas de la aplicación.

## Endpoints Integrados

### 1. Sistema
- **`GET /api/health`** - Verificación de salud del servidor
- **`GET /api/logs`** - Logs de comunicación del servidor

### 2. Relojes
- **`GET /api/watches`** - Lista de sesiones de relojes
- **`GET /api/watches/{imei}`** - Estado del reloj y datos conocidos
- **`GET /api/watches/{imei}/metrics`** - Métricas de salud y sensores
- **`GET /api/watches/{imei}/location`** - Ubicación última conocida
- **`GET /api/watches/{imei}/fall-events`** - Eventos de detección de caída
- **`GET /api/watches/{imei}/alarm/latest`** - Última alarma del reloj
- **`GET /api/watches/{imei}/alarm/events`** - Historial de alarmas

### 3. Eventos Globales
- **`GET /api/fall-events`** - Todos los eventos de caída
- **`GET /api/fall-events/stats`** - Estadísticas de eventos de caída
- **`GET /api/alarm/events`** - Todos los eventos de alarma

## Servicios Implementados

### WatchService
El servicio principal que maneja todas las comunicaciones con la API:

```typescript
// Métodos principales
WatchService.getWatchLocation()           // Ubicación del reloj
WatchService.getWatchStatus()             // Estado general del reloj
WatchService.getWatchMetrics()            // Métricas de salud
WatchService.getWatchFallEvents()         // Eventos de caída
WatchService.getWatchAlarmEvents()        // Historial de alarmas
WatchService.getWatchLatestAlarm()        // Última alarma
WatchService.getFallEventStats()          // Estadísticas de caídas
WatchService.getAllFallEvents()           // Todos los eventos de caída
WatchService.getAllAlarmEvents()          // Todos los eventos de alarma
WatchService.getCommunicationLogs()      // Logs del servidor
WatchService.checkServerHealth()          // Verificar salud del servidor
WatchService.sendCommand()                // Enviar comando al reloj
WatchService.sendRawCommand()             // Enviar comando raw
```

### Hooks Personalizados

#### useWatchMetrics()
Obtiene métricas de salud del reloj:
- Frecuencia cardíaca (actual, reposo, máxima, zona)
- Saturación de oxígeno
- Temperatura (corporal y ambiental)
- Actividad (pasos, calorías, distancia)
- Estado de batería

#### useWatchStatus()
Obtiene el estado general del reloj:
- Estado de conexión (online/offline)
- Última conexión
- Nivel de batería
- Señal GSM
- Satélites GPS
- Modo de trabajo

#### useWatchFallEvents()
Obtiene eventos de detección de caída:
- Lista de eventos con severidad
- Estado de cada evento
- Ubicación y timestamp
- Información de batería y señal

#### useWatchAlarms()
Obtiene alarmas del reloj:
- Historial de alarmas
- Última alarma activa
- Tipos: SOS, caída, batería baja, sin señal, etc.

#### useFallEventStats()
Obtiene estadísticas de eventos de caída:
- Total de eventos
- Eventos por día/semana/mes
- Distribución por severidad

## Pantallas Actualizadas

### 1. Pantalla Principal (Home)
- **Métricas de salud en tiempo real**: Frecuencia cardíaca, oxígeno, temperatura, batería
- **Actividad**: Pasos del día obtenidos del reloj
- **Estado de conexión**: Indicador visual del estado del reloj
- **Comandos al reloj**: Interfaz para enviar comandos

### 2. Nueva Pantalla de Métricas
- **Métricas detalladas**: Frecuencia cardíaca con zonas, oxígeno, temperatura
- **Estado del reloj**: Información completa de conexión y batería
- **Estadísticas de caídas**: Gráficos y datos históricos
- **Eventos recientes**: Lista de eventos de caída con detalles

### 3. Pantalla de Alertas
- **Alertas del reloj**: SOS, caídas, batería baja, sin señal
- **Alertas médicas**: Recordatorios de medicamentos y citas
- **Priorización**: Sistema de prioridades (crítica, alta, media, baja)

### 4. Pantalla de Ubicación
- **Ubicación en tiempo real**: Obtenida del reloj GPS
- **Estado GPS**: Satélites, señal GSM, batería
- **Mapa interactivo**: Visualización de la ubicación actual

## Configuración

### Variables de Entorno
La aplicación usa las siguientes configuraciones en `config/api.ts`:

```typescript
export const API_CONFIG = {
  WATCH_SERVER_URL: 'http://192.168.1.65:8000',
  WATCH_IMEI_CODE: '861265062812547',
  UPDATE_INTERVAL: 10000, // 10 segundos
};
```

### Personalización
Puedes modificar estos valores según tu configuración:
- **WATCH_SERVER_URL**: URL de tu servidor API
- **WATCH_IMEI_CODE**: Código IMEI de tu reloj
- **UPDATE_INTERVAL**: Intervalo de actualización de datos

## Características Implementadas

### ✅ Datos en Tiempo Real
- Actualización automática de métricas cada 30 segundos
- Estado del reloj cada 15 segundos
- Alertas cada minuto
- Estadísticas cada 5 minutos

### ✅ Manejo de Errores
- Fallback a datos simulados si no hay conexión
- Manejo de timeouts y errores de red
- Logs detallados para debugging

### ✅ Interfaz de Usuario
- Indicadores visuales de estado de conexión
- Colores dinámicos según severidad de alertas
- Actualización automática de datos
- Interfaz responsive y moderna

### ✅ Comandos al Reloj
- Envío de comandos estructurados
- Comandos raw para casos especiales
- Feedback visual del estado de envío

## Uso de la Aplicación

### 1. Verificar Conexión
La aplicación verifica automáticamente la conexión con el servidor al iniciar.

### 2. Monitoreo de Salud
- Ve a la pantalla "Métricas" para ver datos detallados
- La pantalla principal muestra un resumen de métricas importantes
- Los datos se actualizan automáticamente

### 3. Alertas y Eventos
- La pantalla "Alerta" muestra todas las alertas del reloj
- Los eventos de caída se muestran en la pantalla de métricas
- Las alertas críticas se destacan visualmente

### 4. Ubicación
- La pantalla "Ubicación" muestra la posición GPS del reloj
- Incluye información de batería, señal y satélites
- Mapa interactivo con marcador de ubicación

### 5. Comandos
- Usa la sección "Comando al Reloj" en la pantalla principal
- Envía comandos como SOS, LOCATION, STATUS
- Los comandos se envían directamente al reloj

## Troubleshooting

### Problemas de Conexión
1. Verifica que el servidor esté ejecutándose en `http://192.168.1.65:8000`
2. Asegúrate de que el dispositivo móvil esté en la misma red
3. Para simulador iOS, cambia la URL a `http://localhost:8000`

### Datos No Se Actualizan
1. Verifica la conexión a internet
2. Revisa los logs de la consola para errores
3. Asegúrate de que el reloj esté conectado y enviando datos

### Comandos No Se Envían
1. Verifica que el reloj esté online
2. Revisa el formato del comando
3. Consulta los logs del servidor para errores

## Próximas Mejoras

- [ ] Configuración de intervalos de actualización
- [ ] Historial de métricas con gráficos
- [ ] Notificaciones push para alertas críticas
- [ ] Exportación de datos de salud
- [ ] Configuración de geocercas
- [ ] Modo offline con sincronización

## Soporte

Para problemas o preguntas sobre la integración:
1. Revisa los logs de la consola
2. Verifica la documentación de la API
3. Consulta los archivos de configuración
4. Revisa el estado de conexión del reloj
