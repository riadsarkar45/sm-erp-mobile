import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AppHeaderProps = {
  onMenuPress: () => void;
  onNotificationsPress: () => void;
};

export default function AppHeader({
  onMenuPress,
  onNotificationsPress,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
      >
        <Ionicons name="menu-outline" size={27} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="layers-outline" size={23} color="#102B52" />
        </View>

        <View>
          <Text style={styles.title}>SM ERP</Text>
          <Text style={styles.subtitle}>Garments Audit System</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onNotificationsPress}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
      >
        <Ionicons
          name="notifications-outline"
          size={23}
          color="#FFFFFF"
        />

        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 66,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102B52',
    gap: 12,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: '#C7D5E9',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1,
    borderColor: '#102B52',
  },
});
