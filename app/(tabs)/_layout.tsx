import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
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

    tabBarStyle: Platform.OS === 'ios'
    ? {
        // ¡sin absolute!
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        paddingTop: 10,
        paddingBottom: insets.bottom,
      }
    : {
        // Android sigue flotante
        position: 'absolute',
        left: 16, right: 16, bottom: 16,
        height: 64,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 24,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
      },

    tabBarBackground: () =>
      isIOS ? (
        <TabBarBackground />
      ) : (
        <View style={{ flex: 1, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.95)' }} />
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