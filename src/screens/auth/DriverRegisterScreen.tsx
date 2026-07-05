import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, DateField, SectionHeader } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'DriverRegister'>;

export default function DriverRegisterScreen({}: Props) {
  const { registerDriver } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '1990-01-01',
    address: '',
    state: '',
    city: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!form.phoneNumber.trim() || form.phoneNumber.trim().length < 10) next.phoneNumber = 'Enter a valid 10-digit number';
    if (!form.password || form.password.length < 6) next.password = 'At least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await registerDriver(form);
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
          <Text style={styles.heading}>Join as a driver</Text>
          <Text style={styles.subheading}>Set up your operator profile to start posting and accepting rides.</Text>

          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          <SectionHeader title="Personal details" />
          <Input label="First Name" value={form.firstName} onChangeText={set('firstName')} required error={errors.firstName} />
          <Input label="Last Name" value={form.lastName} onChangeText={set('lastName')} required error={errors.lastName} />
          <DateField
            label="Date of Birth"
            value={form.dateOfBirth}
            onChange={(iso) => set('dateOfBirth')(iso)}
            required
            maximumDate={new Date()}
          />

          <SectionHeader title="Contact" style={{ marginTop: spacing.sm }} />
          <Input
            label="Email"
            value={form.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            required
            error={errors.email}
          />
          <Input
            label="Phone"
            value={form.phoneNumber}
            onChangeText={set('phoneNumber')}
            keyboardType="phone-pad"
            prefix="+91"
            required
            error={errors.phoneNumber}
          />

          <SectionHeader title="Address" style={{ marginTop: spacing.sm }} />
          <Input label="Address" value={form.address} onChangeText={set('address')} />
          <Input label="City" value={form.city} onChangeText={set('city')} />
          <Input label="State" value={form.state} onChangeText={set('state')} />

          <SectionHeader title="Security" style={{ marginTop: spacing.sm }} />
          <Input
            label="Password"
            value={form.password}
            onChangeText={set('password')}
            secureTextEntry
            required
            error={errors.password}
            helperText={!errors.password ? 'Minimum 6 characters' : undefined}
          />

          <Button title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  heading: { ...typography.h1, color: colors.text, marginBottom: 4 },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  errorBanner: { backgroundColor: colors.errorSurface, borderRadius: 10, padding: spacing.sm, marginBottom: spacing.md },
  errorBannerText: { color: colors.error, fontSize: 13, fontWeight: '600' },
});
