# Configuración del API del Reloj

## Variables de Entorno

Para configurar la conexión con el servidor del reloj, necesitas agregar las siguientes variables a tu archivo `app.config.js`:

```javascript
export default {
  expo: {
    // ... otras configuraciones
    extra: {
      // URL del servidor del reloj
      WATCH_SERVER_URL: process.env.WATCH_SERVER_URL || 'http://localhost:8000',
      
      // Código IMEI del reloj
      WATCH_IMEI_CODE: process.env.WATCH_IMEI_CODE || '861265062812547',
      
      // API Key de Google Maps (opcional)
      API_KEY_GMAPS: process.env.API_KEY_GMAPS,
    },
  },
};
```

### Configuración de Red

**⚠️ IMPORTANTE**: El error "Network request failed" es común y se debe a la configuración de red. Aquí están las soluciones:

#### Para Simulador iOS:
```javascript
WATCH_SERVER_URL: "http://localhost:8000"
```

#### Para Dispositivo Físico:
```javascript
WATCH_SERVER_URL: "http://192.168.1.100:8000"  // Usa la IP real de tu servidor
```

#### Para Emulador Android:
```javascript
WATCH_SERVER_URL: "http://10.0.2.2:8000"  // IP especial para Android emulator
```

### Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
WATCH_SERVER_URL=http://localhost:8000
WATCH_IMEI_CODE=861265062812547
API_KEY_GMAPS=tu_api_key_aqui
```

## Endpoint del API

El endpoint que se utiliza es:
```
GET http://server:8000/api/watches/<IMEI_CODE>/location
```

## Respuesta del API

El API retorna un JSON con la siguiente estructura:

```json
{
  "raw": "<RAW_DATA>",
  "received_at": "2025-09-05T22:37:08.972126",
  "parsed": {
    "raw": "<RAW_DATA>",
    "valid": true,
    "date": "2025-09-06",
    "time_utc": "37:08:16",
    "timestamp_utc": null,
    "latitude": <LAT>,
    "longitude": <LONG>,
    "lat_ddmm": "<LAT2>",
    "lon_ddmm": "<LONG2>",
    "speed_kmh": 0.004,
    "direction_deg": 7.54,
    "status": {
      "gsm_signal": 60,
      "satellites": 12,
      "battery": 47,
      "remaining_space": 0,
      "fortification_state": 0,
      "working_mode": 3
    },
    "lbs": {
      "mcc": 334,
      "mnc": 3,
      "lac": 30424,
      "cid": 39525930
    },
    "wifi": [
      {
        "ssid": null,
        "mac": "b2-19-21-21-11-a6",
        "rssi": 101
      }
    ]
  }
}
```

## Uso en la Aplicación

La aplicación utiliza el servicio `WatchService` para hacer las solicitudes HTTP:

```typescript
import { WatchService } from '@/services/watchService';

// Obtener ubicación del reloj
const location = await WatchService.getWatchLocation();

// Con parámetros personalizados
const location = await WatchService.getWatchLocation({
  serverUrl: 'http://mi-servidor:8000',
  imeiCode: 'MI_IMEI_CODE'
});
```

## Manejo de Errores

El servicio maneja automáticamente:
- Timeouts (10 segundos)
- Errores de red
- Respuestas inválidas
- Datos de ubicación no válidos

En caso de error, se muestra una ubicación por defecto (Ciudad de México).
