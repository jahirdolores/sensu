import { Edge } from 'react-native-safe-area-context';

/**
 * Hook para obtener la configuración de edges de SafeAreaView
 * optimizada para iOS con Dynamic Island
 */
export function useSafeAreaEdges() {
  return {
    // Para pantallas que solo necesitan protección superior
    topOnly: ['top'] as Edge[],
    
    // Para pantallas que solo necesitan protección inferior
    bottomOnly: ['bottom'] as Edge[],
    
    // Para pantallas que necesitan protección superior e inferior
    topAndBottom: ['top', 'bottom'] as Edge[],
    
    // Para pantallas que necesitan protección completa
    all: ['top', 'bottom', 'left', 'right'] as Edge[],
  };
}
