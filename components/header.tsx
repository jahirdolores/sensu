import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from "./ui/IconSymbol";

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoutButton: {
    padding: 4,
  },
});

export default function Header() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.header, 
      { 
        paddingTop: insets.top + (Platform.OS === 'ios' ? -40 : 0),
        paddingBottom: Platform.OS === 'ios' ? 10 : 16,
        backgroundColor: '#ffffff',
      }
    ]}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <IconSymbol name="square.stack.3d.up.fill" size={22} color="black" />
        </View>
        <Text style={styles.logoText}>Sensu</Text>
      </View>
      <View style={styles.headerRight}>
        <Image 
          source={require('@/assets/images/relaxhome.jpg')} 
          style={styles.profileImage}
        />
        <Pressable style={styles.logoutButton}>
          <IconSymbol name="exit-outline" size={20} color="#666" />
        </Pressable>
      </View>
    </View>
  );
}