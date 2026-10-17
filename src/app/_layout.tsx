import React, { useEffect } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Stack,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/hooks/auth/useAuthContext';
import AppLayout from '@/components/layout/appLayout';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      void SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {loading ? (
        <AnimatedSplashOverlay />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="work-orders" />
            <Stack.Screen name="style-requirements" />
            <Stack.Screen name="movement-billing" />
            <Stack.Screen name="mis" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="login" />
          </Stack.Protected>
        </Stack>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated) {
    return <RootNavigator />;
  }

  return (
    <AppLayout>
      <RootNavigator />
    </AppLayout>
  );
}