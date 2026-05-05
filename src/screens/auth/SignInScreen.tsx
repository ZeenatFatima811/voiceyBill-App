import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '../../features/auth/authAPI';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import Logo from '../../components/common/Logo';

export default function SignInScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [login, { isLoading }] = useLoginMutation();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
    } catch (error: any) {
      setErrors({
        email: error?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          {/* Logo/Brand */}
          <View style={styles.header}>
            <Logo size="lg" />
            <Text style={styles.title}>Login to your account</Text>
            <Text style={styles.subtitle}>
              Enter your email below to login to your account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="a@example.com"
                placeholderTextColor={themeColors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="*******"
                placeholderTextColor={themeColors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingTop: spacing.xxl,
      paddingBottom: spacing.xxl,
    },
    content: {
      maxWidth: 400,
      width: '100%',
      alignSelf: 'center',
    },
    header: {
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: theme.foreground,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
      textAlign: 'center',
    },
    form: {
      gap: spacing.md,
    },
    inputGroup: {
      gap: spacing.sm,
    },
    label: {
      fontSize: fontSize.sm,
      color: theme.foreground,
      fontWeight: fontWeight.medium,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: theme.foreground,
      backgroundColor: theme.card,
    },
    error: {
      fontSize: fontSize.xs,
      color: theme.destructive,
      marginTop: spacing.xs,
    },
    button: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    footerText: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
    },
    link: {
      fontSize: fontSize.sm,
      color: theme.primary,
      fontWeight: fontWeight.medium,
      textDecorationLine: 'underline',
    },
  });
