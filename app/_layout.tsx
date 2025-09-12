import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Hace la barra de navegación transparente y superpuesta
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
      // Se superpone al contenido y se oculta con gesto
      NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => {});
    }
  }, [colorScheme]);

  if (!loaded) return null;

  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

        {/* StatusBar translúcido para dibujar por debajo de la isla / status bar */}
        <StatusBar
          translucent
          backgroundColor="transparent"
          style={colorScheme === 'dark' ? 'light' : 'dark'}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
