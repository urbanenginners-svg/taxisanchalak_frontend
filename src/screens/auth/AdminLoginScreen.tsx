import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, Icon } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdminLogin'>;

export default function AdminLoginScreen({}: Props) {
  const { loginAdmin } = useAuth();
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
      await loginAdmin(email.trim(), password);
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
            value={email}
            onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="admin@taxisanchalak.com"
            leftIcon="mail-outline"
            required
            error={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: undefined })); }}
            secureTextEntry
            leftIcon="lock-closed-outline"
            required
            error={errors.password}
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
