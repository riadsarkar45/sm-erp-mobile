
import React, { useState, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { usePathname, useRouter } from 'expo-router';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';



type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleNavigate = (route: string) => {
    closeSidebar();
    router.push(route as never);
  };

  const handleNotificationsPress = () => {
    router.push('/notifications' as never);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style="light" />

      <View style={styles.container}>
        <AppHeader
          onMenuPress={() => setSidebarVisible(true)}
          onNotificationsPress={handleNotificationsPress}
        />

        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {children}
        </KeyboardAvoidingView>

        <AppSidebar
          visible={sidebarVisible}
          onClose={closeSidebar}
          onNavigate={handleNavigate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#102B52',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    flex: 1,
  },
});
