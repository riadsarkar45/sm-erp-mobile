
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuthContext';

export default function HomeScreen() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />
  );
}
