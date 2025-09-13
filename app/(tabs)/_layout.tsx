import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const isIOS = Platform.OS === 'ios';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: tint,
          tabBarButton: HapticTab,

          tabBarStyle: isIOS
            ? {
                // iOS: NO absoluto; empuja el contenido
                backgroundColor: '#808080',
                borderTopWidth: 0.5,
                borderTopColor: '#666666',
                paddingTop: 5,
                paddingBottom: insets.bottom + 5,
                height: 30 + insets.bottom,
              }
            : {
                // Android: flotante
                position: 'absolute',
                left: 16,
                right: 16,
                bottom: 0,
                height: 30,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 0,
                borderTopWidth: 0.5,
                borderTopColor: '#666666',
                backgroundColor: '#808080',
                elevation: 8,
              },

          tabBarBackground: () => (
              <View
                style={{
                  flex: 1,
                  borderRadius: 0,
                  backgroundColor: '#808080',
                }}
              />
            ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="alerta"
          options={{
            title: 'Alerta',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ubicacion"
          options={{
            title: 'Ubicación',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="location.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="yo"
          options={{
            title: 'Yo',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
