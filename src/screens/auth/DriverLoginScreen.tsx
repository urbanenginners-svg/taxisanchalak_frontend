import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'DriverLogin'>;

export default function DriverLoginScreen({ navigation }: Props) {
  const { loginDriver } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await loginDriver(email.trim(), password);
    } catch (e) {
      setFormError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Log in to manage your rides, fleet and requests.</Text>

          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="driver@example.com"
            leftIcon="mail-outline"
            required
            error={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: undefined })); }}
            secureTextEntry
            placeholder="Your password"
            leftIcon="lock-closed-outline"
            required
            error={errors.password}
          />
          <Button title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.sm }} />

          <TouchableOpacity onPress={() => navigation.navigate('DriverRegister')} style={styles.footerLink}>
            <Text style={styles.footerText}>
              New to Taxi Sanchalak? <Text style={styles.footerLinkStrong}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, flexGrow: 1 },
  heading: { ...typography.h1, color: colors.text, marginBottom: 4 },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  errorBanner: { backgroundColor: colors.errorSurface, borderRadius: 10, padding: spacing.sm, marginBottom: spacing.md },
  errorBannerText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  footerLink: { marginTop: spacing.lg, alignItems: 'center' },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  footerLinkStrong: { color: colors.primaryDark, fontWeight: '700' },
});
