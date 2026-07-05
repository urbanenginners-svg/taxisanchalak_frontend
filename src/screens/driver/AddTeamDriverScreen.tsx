import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type TeamDriverForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export default function AddTeamDriverScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<TeamDriverForm>(
    { firstName: '', lastName: '', phoneNumber: '', email: '' },
    {
      firstName: [validators.required('First name is required')],
      lastName: [validators.required('Last name is required')],
      phoneNumber: [validators.required('Phone is required'), validators.phone()],
      email: [validators.email()],
    },
  );

  const submit = async () => {
    setFormError('');
    if (!form.validateAll()) return;
    setLoading(true);
    try {
      await teamDriverApi.create({
        firstName: form.values.firstName.trim(),
        lastName: form.values.lastName.trim(),
        phoneNumber: form.values.phoneNumber.trim(),
        email: form.values.email.trim() || undefined,
      });
      toast.show('Team driver added', 'success');
      navigation.goBack();
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
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          <Input label="First Name" value={form.values.firstName} onChangeText={(t) => form.setValue('firstName', t)} onBlur={() => form.blur('firstName')} required error={form.fieldError('firstName')} />
          <Input label="Last Name" value={form.values.lastName} onChangeText={(t) => form.setValue('lastName', t)} onBlur={() => form.blur('lastName')} required error={form.fieldError('lastName')} />
          <Input label="Phone" value={form.values.phoneNumber} onChangeText={(t) => form.setValue('phoneNumber', t)} onBlur={() => form.blur('phoneNumber')} keyboardType="phone-pad" prefix="+91" required error={form.fieldError('phoneNumber')} />
          <Input label="Email (optional)" value={form.values.email} onChangeText={(t) => form.setValue('email', t)} onBlur={() => form.blur('email')} keyboardType="email-address" autoCapitalize="none" error={form.fieldError('email')} />
          <Button title="Save Team Driver" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  formError: { ...typography.bodySmallMedium, color: colors.error, marginBottom: spacing.md },
});
