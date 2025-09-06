import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Tipos para perfil de usuario
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // en cm
  weight?: number; // en kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalConditions?: string[];
  medications?: string[];
  allergies?: string[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareHealthData: boolean;
    shareLocation: boolean;
    shareWithFamily: boolean;
  };
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'auto';
    units: 'metric' | 'imperial';
  };
}

interface UseProfileReturn {
  profile: UserProfile | null;
  settings: ProfileSettings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<ProfileSettings>) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

/**
 * Hook personalizado para manejar el perfil de usuario
 * Se alimenta de endpoints de perfil (simulado por ahora)
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      shareHealthData: false,
      shareLocation: false,
      shareWithFamily: true,
    },
    preferences: {
      language: 'es',
      theme: 'auto',
      units: 'metric',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular llamada a API de perfil
      // En una implementación real, esto sería una llamada HTTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProfile: UserProfile = {
        id: '1',
        name: 'Usuario Demo',
        email: 'usuario@demo.com',
        phone: '+52 55 1234 5678',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        height: 175,
        weight: 70,
        bloodType: 'O+',
        emergencyContact: {
          name: 'María García',
          phone: '+52 55 9876 5432',
          relationship: 'Esposa',
        },
        medicalConditions: ['Hipertensión', 'Diabetes tipo 2'],
        medications: ['Metformina 500mg', 'Losartán 50mg'],
        allergies: ['Penicilina', 'Polen'],
        avatar: undefined,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
        updatedAt: new Date().toISOString(),
      };
      
      setProfile(mockProfile);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener perfil';
      setError(errorMessage);
      console.error('Error en useProfile:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfile(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      } : null);
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<ProfileSettings>) => {
    try {
      // Simular actualización en API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(prev => ({ ...prev, ...updates }));
      
      Alert.alert('Éxito', 'Configuración actualizada correctamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar configuración';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const uploadAvatar = useCallback(async (imageUri: string) => {
    try {
      // Simular subida de imagen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProfile(prev => prev ? {
        ...prev,
        avatar: imageUri,
        updatedAt: new Date().toISOString(),
      } : null);
      
      Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir foto de perfil';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      // Simular eliminación de cuenta
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProfile(null);
      
      Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido eliminada correctamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar cuenta';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    settings,
    loading,
    error,
    refresh,
    updateProfile,
    updateSettings,
    uploadAvatar,
    deleteAccount,
  };
}
