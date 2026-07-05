import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, Icon } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdminLogin'>;
type AdminLoginForm = { email: string; password: string };

export default function AdminLoginScreen({}: Props) {
  const { loginAdmin } = useAuth();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<AdminLoginForm>(
    { email: '', password: '' },
    {
      email: [validators.required('Email is required'), validators.email()],
      password: [validators.required('Password is required')],
    },
  );

  const handleLogin = async () => {
    setFormError('');
    if (!form.validateAll()) return;
    setLoading(true);
    try {
      await loginAdmin(form.values.email.trim(), form.values.password);
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
          <View style={styles.badge}>
            <Icon name="shield-checkmark-outline" size={26} color={colors.header} />
          </View>
          <Text style={styles.heading}>Admin console</Text>
          <Text style={styles.subheading}>Restricted access for platform administrators.</Text>

          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          <Input
            label="Admin Email"
            value={form.values.email}
            onChangeText={(t) => form.setValue('email', t)}
            onBlur={() => form.blur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="admin@taxisanchalak.com"
            leftIcon="mail-outline"
            required
            error={form.fieldError('email')}
          />
          <Input
            label="Password"
            value={form.values.password}
            onChangeText={(t) => form.setValue('password', t)}
            onBlur={() => form.blur('password')}
            secureTextEntry
            leftIcon="lock-closed-outline"
            required
            error={form.fieldError('password')}
          />
          <Button title="Admin Login" onPress={handleLogin} loading={loading} variant="secondary" style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, flexGrow: 1 },
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.neutralSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: { ...typography.h1, color: colors.text, marginBottom: 4 },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  errorBanner: { backgroundColor: colors.errorSurface, borderRadius: 10, padding: spacing.sm, marginBottom: spacing.md },
  errorBannerText: { color: colors.error, fontSize: 13, fontWeight: '600' },
});
