
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

type MenuItem = {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type AppSidebarProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
};

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/(tabs)',
    icon: 'grid-outline',
  },
  {
    label: 'Requested Work Orders',
    route: '/work-orders',
    icon: 'document-text-outline',
  },
  {
    label: 'Style Requirements',
    route: '/style-requirements',
    icon: 'shirt-outline',
  },
  {
    label: 'Movement & Billing',
    route: '/movement-billing',
    icon: 'swap-horizontal-outline',
  },
  {
    label: 'MIS Reports',
    route: '/mis',
    icon: 'bar-chart-outline',
  },
  {
    label: 'Notifications',
    route: '/notifications',
    icon: 'notifications-outline',
  },
  {
    label: 'Settings',
    route: '/settings',
    icon: 'settings-outline',
  },
];

export default function AppSidebar({
  visible,
  onClose,
  onNavigate,
  onLogout,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close navigation menu"
        />

        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Ionicons
                  name="layers-outline"
                  size={25}
                  color="#102B52"
                />
              </View>

              <View style={styles.brandText}>
                <Text style={styles.brandTitle}>SM ERP</Text>
                <Text style={styles.brandSubtitle}>
                  Garments Audit System
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <Ionicons name="close" size={23} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>MAIN MENU</Text>

            {menuItems.map((item) => {
              const active =
                item.route === '/(tabs)'
                  ? pathname === '/(tabs)' ||
                    pathname === '/(tabs)/' ||
                    pathname === '/'
                  : pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);

              return (
                <TouchableOpacity
                  key={item.route}
                  onPress={() => onNavigate(item.route)}
                  style={[
                    styles.menuItem,
                    active && styles.menuItemActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={active ? '#FFFFFF' : '#64748B'}
                  />

                  <Text
                    style={[
                      styles.menuLabel,
                      active && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {active && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {onLogout && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  onClose();
                  onLogout();
                }}
                accessibilityRole="button"
              >
                <Ionicons
                  name="log-out-outline"
                  size={21}
                  color="#DC2626"
                />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },
  sidebar: {
    width: '82%',
    maxWidth: 330,
    height: '100%',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: { elevation: 12 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 4, height: 0 },
      },
    }),
  },
  sidebarHeader: {
    minHeight: 112,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 42 : 20,
    paddingBottom: 18,
    backgroundColor: '#102B52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 11,
  },
  logo: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    flex: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  brandSubtitle: {
    marginTop: 3,
    fontSize: 10,
    color: '#C7D5E9',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginLeft: 8,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingHorizontal: 12,
    paddingTop: 23,
    paddingBottom: 20,
  },
  sectionLabel: {
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#94A3B8',
  },
  menuItem: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 5,
    borderRadius: 11,
    gap: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#102B52',
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  menuLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 5,
    height: 23,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
    position: 'absolute',
    right: 0,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E8EDF4',
    padding: 15,
  },
  logoutButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    gap: 12,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});