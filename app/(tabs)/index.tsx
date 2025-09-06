import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#8EC5FF', dark: '#123A6F' }}
        headerImage={
          <Image
            source={require('@/assets/images/relaxhome.jpg')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Today</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Health Overview
        </ThemedText>

        <View style={styles.cardRow}>
          <ThemedView style={[styles.card, styles.heartCard]}>
            <View style={styles.iconBadge}>
              <IconSymbol name="heart.fill" size={22} color="#ffffff" />
            </View>
            <ThemedText lightColor="#E6F0FF" darkColor="#E6F0FF" style={styles.cardLabel}>
              Heart Rate
            </ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff" style={styles.cardValue}>
              72 BPM
            </ThemedText>
            <ThemedText lightColor="#D6E6FF" darkColor="#D6E6FF" style={styles.cardSub}>
              Resting
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.card, styles.stepsCard]}>
            <View style={styles.iconBadge}>
              <IconSymbol name="figure.walk" size={22} color="#ffffff" />
            </View>
            <ThemedText lightColor="#E6F0FF" darkColor="#E6F0FF" style={styles.cardLabel}>
              Steps
            </ThemedText>
            <ThemedText lightColor="#ffffff" darkColor="#ffffff" style={styles.cardValue}>
              6,842
            </ThemedText>
            <ThemedText lightColor="#D6E6FF" darkColor="#D6E6FF" style={styles.cardSub}>
              of 10,000
            </ThemedText>
          </ThemedView>
        </View>

        <View style={styles.controlsRow}>
          <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}>
            <ThemedText lightColor={Colors.light.text} darkColor={Colors.dark.text} style={styles.controlLabel}>
              Start
            </ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}>
            <ThemedText lightColor={Colors.light.text} darkColor={Colors.dark.text} style={styles.controlLabel}>
              Pause
            </ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}>
            <ThemedText lightColor={Colors.light.text} darkColor={Colors.dark.text} style={styles.controlLabel}>
              Reset
            </ThemedText>
          </Pressable>
        </View>

        <ThemedView style={styles.placeholderCard}>
          <ThemedText type="defaultSemiBold">Insights</ThemedText>
          <ThemedText style={{ opacity: 0.7 }}>Weekly charts and trends coming soon.</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heartCard: {
    backgroundColor: '#2D81FF',
  },
  stepsCard: {
    backgroundColor: '#1E5DBE',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
  },
  cardValue: {
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardSub: {
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(13,58,111,0.25)',
    backgroundColor: 'rgba(13,58,111,0.06)',
  },
  controlButtonPressed: {
    backgroundColor: 'rgba(13,58,111,0.12)',
  },
  controlLabel: {
    fontWeight: '600',
  },
  placeholderCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(13,58,111,0.15)',
    backgroundColor: 'rgba(13,58,111,0.04)',
    gap: 6,
  },
  reactLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
