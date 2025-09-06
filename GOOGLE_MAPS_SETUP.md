# Configuración de Google Maps para Sensu App

## Pasos para configurar Google Maps API

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Geocoding API** (opcional, para geocodificación)

### 2. Crear credenciales

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "API Key"
3. Copia tu API key

### 3. Configurar la API Key usando variables de entorno

#### Paso 1: Crear archivo .env
Crea un archivo `.env` en la raíz del proyecto:
```bash
# Google Maps API Key
API_KEY_GMAPS=TU_API_KEY_DE_GOOGLE_MAPS_AQUI

# API Endpoint para ubicación del reloj
WATCH_LOCATION_API=https://tu-api.com/watch-location
```

#### Paso 2: Usar el archivo .env.example como referencia
```bash
cp .env.example .env
# Luego edita el archivo .env con tus valores reales
```

#### Paso 3: La configuración se carga automáticamente
La app ya está configurada para usar las variables de entorno desde:
- `app.config.js` - Para la configuración de Expo
- `config/api.ts` - Para el código de la aplicación

### 4. Configurar restricciones de API Key (Recomendado para producción)

1. En Google Cloud Console, ve a tu API Key
2. En "Application restrictions":
   - Para Android: Agrega tu SHA-1 fingerprint
   - Para iOS: Agrega tu Bundle ID
3. En "API restrictions": Selecciona solo las APIs que necesitas

### 5. Configurar tu API de ubicación del reloj

En `config/api.ts`, actualiza:
```typescript
export const API_CONFIG = {
  WATCH_LOCATION_API: 'https://tu-servidor.com/api/watch-location',
  // ... resto de configuración
};
```

### Formato esperado de la API

Tu API debe devolver un JSON con este formato:
```json
{
  "latitude": 19.4326,
  "longitude": -99.1332,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Notas importantes

- **iOS**: En Expo Go, no uses `provider={PROVIDER_GOOGLE}` ya que puede causar problemas
- **Android**: Requiere `provider={PROVIDER_GOOGLE}` para usar Google Maps
- La app actualiza la ubicación cada 30 segundos automáticamente
- Si la API falla, se muestra la ubicación por defecto (Ciudad de México)

### Troubleshooting

1. **Mapa no se muestra**: Verifica que la API Key esté correctamente configurada
2. **Error de permisos**: Asegúrate de que las APIs estén habilitadas en Google Cloud Console
3. **Ubicación no se actualiza**: Verifica que tu API endpoint esté funcionando correctamente
