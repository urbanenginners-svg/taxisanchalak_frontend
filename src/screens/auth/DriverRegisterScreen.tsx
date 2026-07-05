import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, DateField, SectionHeader } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'DriverRegister'>;

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  state: string;
  city: string;
  password: string;
};

export default function DriverRegisterScreen({}: Props) {
  const { registerDriver } = useAuth();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<RegisterForm>(
    {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '1990-01-01',
      address: '',
      state: '',
      city: '',
      password: '',
    },
    {
      firstName: [validators.required('First name is required')],
      lastName: [validators.required('Last name is required')],
      email: [validators.required('Email is required'), validators.email()],
      phoneNumber: [validators.required('Phone is required'), validators.phone()],
      dateOfBirth: [validators.required('Date of birth is required')],
      password: [validators.required('Password is required'), validators.minLength(6, 'At least 6 characters')],
    },
  );

  const handleRegister = async () => {
    setFormError('');
    if (!form.validateAll()) return;
    setLoading(true);
    try {
      await registerDriver(form.values);
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
          <Input label="First Name" value={form.values.firstName} onChangeText={(t) => form.setValue('firstName', t)} onBlur={() => form.blur('firstName')} required error={form.fieldError('firstName')} />
          <Input label="Last Name" value={form.values.lastName} onChangeText={(t) => form.setValue('lastName', t)} onBlur={() => form.blur('lastName')} required error={form.fieldError('lastName')} />
          <DateField
            label="Date of Birth"
            value={form.values.dateOfBirth}
            onChange={(iso) => form.setValue('dateOfBirth', iso)}
            onBlur={() => form.blur('dateOfBirth')}
            required
            error={form.fieldError('dateOfBirth')}
            maximumDate={new Date()}
          />

          <SectionHeader title="Contact" style={{ marginTop: spacing.sm }} />
          <Input
            label="Email"
            value={form.values.email}
            onChangeText={(t) => form.setValue('email', t)}
            onBlur={() => form.blur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            required
            error={form.fieldError('email')}
          />
          <Input
            label="Phone"
            value={form.values.phoneNumber}
            onChangeText={(t) => form.setValue('phoneNumber', t)}
            onBlur={() => form.blur('phoneNumber')}
            keyboardType="phone-pad"
            prefix="+91"
            required
            error={form.fieldError('phoneNumber')}
          />

          <SectionHeader title="Address" style={{ marginTop: spacing.sm }} />
          <Input label="Address" value={form.values.address} onChangeText={(t) => form.setValue('address', t)} />
          <Input label="City" value={form.values.city} onChangeText={(t) => form.setValue('city', t)} />
          <Input label="State" value={form.values.state} onChangeText={(t) => form.setValue('state', t)} />

          <SectionHeader title="Security" style={{ marginTop: spacing.sm }} />
          <Input
            label="Password"
            value={form.values.password}
            onChangeText={(t) => form.setValue('password', t)}
            onBlur={() => form.blur('password')}
            secureTextEntry
            required
            error={form.fieldError('password')}
            helperText={!form.fieldError('password') ? 'Minimum 6 characters' : undefined}
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
