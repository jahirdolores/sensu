# Configuración de Variables de Entorno

## Configuración Rápida

### 1. Crear archivo .env
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus valores reales
nano .env
```

### 2. Configurar tu API Key
En el archivo `.env`, reemplaza:
```bash
API_KEY_GMAPS=TU_API_KEY_DE_GOOGLE_MAPS_AQUI
```

Con tu API key real:
```bash
API_KEY_GMAPS=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Configurar tu API de ubicación
```bash
WATCH_LOCATION_API=https://tu-servidor.com/api/watch-location
```

### 4. Reiniciar la aplicación
```bash
# Detén la aplicación si está corriendo
# Luego reinicia
npm start
# o
expo start
```

## Archivos Modificados

- ✅ `.env` - Variables de entorno (crear manualmente)
- ✅ `.env.example` - Plantilla de variables de entorno
- ✅ `app.config.js` - Configuración de Expo con variables de entorno
- ✅ `config/api.ts` - Configuración de APIs usando variables de entorno
- ✅ `.gitignore` - Agregado `.env` para no subirlo al repositorio

## Verificación

Para verificar que las variables se están cargando correctamente, puedes agregar un `console.log` temporal en `config/api.ts`:

```typescript
console.log('API Key:', API_CONFIG.GOOGLE_MAPS_API_KEY);
console.log('Watch API:', API_CONFIG.WATCH_LOCATION_API);
```
