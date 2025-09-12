import { WatchService } from '@/services/watchService';

// Ejemplo de envío de comando raw
const sendRawCommand = async () => {
  try {
    const response = await WatchService.sendRawCommand(
      'IWBP33,861265062812547,080835,1#', // payload raw
      {
        // parámetros opcionales
        // imeiCode: '123456789'
      }
    );

    if (response.success) {
      console.log('Comando raw enviado:', response.data);
    } else {
      console.error('Error al enviar comando raw:', response.message);
    }
  } catch (error) {
    console.error('Error en operación raw:', error);
  }
};

// Ejemplo de verificación de salud del servidor
const checkHealth = async () => {
  try {
    const isHealthy = await WatchService.checkServerHealth();
    console.log('Estado del servidor:', isHealthy ? 'OK' : 'Error');
  } catch (error) {
    console.error('Error al verificar servidor:', error);
  }
};
export {
  checkHealth, sendRawCommand
};

