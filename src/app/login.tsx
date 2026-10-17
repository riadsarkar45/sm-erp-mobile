
import { useAuth } from '@/hooks/auth/useAuthContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';


const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  background: '#F4F7FC',
  surface: '#FFFFFF',
  heading: '#10213A',
  text: '#475569',
  muted: '#94A3B8',
  border: '#E2E8F0',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  success: '#15803D',
};

function BrandLogo() {
  return (
    <View style={styles.brandContainer}>
      <View style={styles.logo}>
        <View style={styles.logoLineOne} />
        <View style={styles.logoLineTwo} />
        <View style={styles.logoLineThree} />
      </View>

      <Text style={styles.brandName}>
        SM <Text style={styles.brandBlue}>ERP</Text>
      </Text>

      <Text style={styles.brandSubtitle}>
        GARMENT INTERNAL AUDIT ERP
      </Text>

      <View style={styles.brandDivider}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

function CustomError({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorIconText}>!</Text>
      </View>

      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Unable to sign in</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>

      <TouchableOpacity
        onPress={onDismiss}
        style={styles.dismissButton}
        accessibilityLabel="Dismiss error"
        accessibilityRole="button"
      >
        <Text style={styles.dismissText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

function FieldError({ message }: { message: string }) {
  if (!message) return null;

  return <Text style={styles.fieldError}>{message}</Text>;
}

export default function Login() {
  const { login } = useAuth();

  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    phoneNo?: string;
    password?: string;
  }>({});

  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors: {
      phoneNo?: string;
      password?: string;
    } = {};

    if (!phoneNo.trim()) {
      nextErrors.phoneNo = 'Phone number is required.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (loading) return;

    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      // AuthContext handles POST /api/auth/login
      // and updates the authenticated user and access token.
      await login(phoneNo.trim(), password);

      // Stack.Protected in app/_layout.tsx will
      // redirect to the protected tabs after login.
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        request?: unknown;
        message?: string;
      };

      const message =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        (apiError.request
          ? 'Could not reach the server. Check your internet connection and try again.'
          : apiError.message) ||
        'Unable to sign in. Please try again.';

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setServerError(
      'Please contact your ERP administrator to reset your password.',
    );
  };

  const updatePhoneNo = (value: string) => {
    setPhoneNo(value);
    setServerError('');

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        phoneNo: undefined,
      }));
    }
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setServerError('');

    if (value) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandLogo />

        <View style={styles.formCard}>
          <View style={styles.headingRow}>
            <View style={styles.headingAccent} />

            <View style={styles.headingContent}>
              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.description}>
                Sign in to your workspace
              </Text>
            </View>
          </View>

          <CustomError
            message={serverError}
            onDismiss={() => setServerError('')}
          />

          {/* Phone number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>

            <View
              style={[
                styles.inputWrapper,
                errors.phoneNo ? styles.inputError : undefined,
              ]}
            >
              <View style={styles.inputIconBox}>
                <Text style={styles.userIcon}>U</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.muted}
                value={phoneNo}
                onChangeText={updatePhoneNo}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="tel"
                keyboardType="phone-pad"
                editable={!loading}
                returnKeyType="next"
                accessibilityLabel="Phone number"
              />
            </View>

            <FieldError message={errors.phoneNo ?? ''} />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PASSWORD</Text>

            <View
              style={[
                styles.inputWrapper,
                errors.password ? styles.inputError : undefined,
              ]}
            >
              <View style={styles.inputIconBox}>
                <Text style={styles.lockIcon}>▣</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.muted}
                value={password}
                onChangeText={updatePassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />

              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                <View style={styles.eyeShape}>
                  <View style={styles.eyePupil} />

                  {!showPassword && <View style={styles.eyeSlash} />}
                </View>
              </TouchableOpacity>
            </View>

            <FieldError message={errors.password ?? ''} />
          </View>

          {/* Options */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe((prev) => !prev)}
              activeOpacity={0.75}
              disabled={loading}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe ? styles.checkboxChecked : undefined,
                ]}
              >
                {rememberMe && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>

              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading ? styles.loginButtonLoading : undefined,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>

                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <View style={styles.securityBadge}>
              <Text style={styles.securityCheck}>✓</Text>
            </View>

            <Text style={styles.securityText}>
              Your workspace. Your secure access.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            SM ERP <Text style={styles.footerVersion}>· v1.0.0</Text>
          </Text>

          <View style={styles.footerRight}>
            <View style={styles.footerDot} />
            <Text style={styles.footerStatus}>System access</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 22,
  },

  brandContainer: {
    alignItems: 'center',
    marginBottom: 34,
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    transform: [{ rotate: '-4deg' }],
  },

  logoLineOne: {
    width: 29,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    transform: [{ skewX: '-30deg' }],
    marginBottom: 3,
  },

  logoLineTwo: {
    width: 35,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#BFDBFE',
    transform: [{ skewX: '-30deg' }],
    marginBottom: 3,
  },

  logoLineThree: {
    width: 25,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    transform: [{ skewX: '-30deg' }],
  },

  brandName: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.3,
    color: COLORS.heading,
  },

  brandBlue: {
    color: COLORS.primary,
  },

  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.text,
    marginTop: 7,
  },

  brandDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
    gap: 8,
  },

  dividerLine: {
    width: 36,
    height: 1,
    backgroundColor: '#CBD5E1',
  },

  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 22,
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.055,
    shadowRadius: 24,
    elevation: 4,
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 27,
  },

  headingAccent: {
    width: 4,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 13,
  },

  headingContent: {
    flex: 1,
  },

  heading: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: COLORS.heading,
  },

  description: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 5,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 20,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: COLORS.errorBg,
  },

  errorIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginRight: 9,
  },

  errorIconText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.error,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.error,
    marginBottom: 4,
  },

  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    color: '#991B1B',
  },

  dismissButton: {
    paddingHorizontal: 5,
    marginLeft: 5,
  },

  dismissText: {
    fontSize: 23,
    lineHeight: 23,
    color: '#991B1B',
  },

  fieldGroup: {
    marginBottom: 21,
  },

  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: COLORS.text,
    marginBottom: 9,
  },

  inputWrapper: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: '#FBFCFE',
    paddingHorizontal: 12,
  },

  inputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFAFA',
  },

  inputIconBox: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  userIcon: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },

  lockIcon: {
    fontSize: 17,
    color: COLORS.primary,
  },

  input: {
    flex: 1,
    minWidth: 0,
    height: 52,
    paddingVertical: 0,
    fontSize: 14,
    color: COLORS.heading,
  },

  visibilityButton: {
    padding: 8,
    marginLeft: 4,
  },

  eyeShape: {
    width: 21,
    height: 14,
    borderWidth: 1.7,
    borderColor: '#64748B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },

  eyeSlash: {
    position: 'absolute',
    width: 25,
    height: 2,
    backgroundColor: '#64748B',
    transform: [{ rotate: '-42deg' }],
  },

  fieldError: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.error,
    marginTop: 6,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 12,
    marginTop: 1,
    marginBottom: 25,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkmark: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  rememberText: {
    fontSize: 12,
    color: COLORS.text,
  },

  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },

  loginButton: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  loginButtonLoading: {
    opacity: 0.75,
  },

  loginButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },

  arrowCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.17)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  arrowText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  securityBadge: {
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    marginRight: 7,
  },

  securityCheck: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.success,
  },

  securityText: {
    fontSize: 10,
    color: COLORS.muted,
  },

  footer: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 8,
  },

  footerBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.heading,
  },

  footerVersion: {
    fontWeight: '500',
    color: COLORS.muted,
  },

  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 7,
  },

  footerStatus: {
    fontSize: 11,
    color: COLORS.text,
  },
});
