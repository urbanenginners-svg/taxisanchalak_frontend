import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, useToast } from '../../components/ui';
import { spacing } from '../../theme';

export default function AddTeamDriverScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = 'Required';
    if (!lastName.trim()) next.lastName = 'Required';
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) next.phoneNumber = 'Enter a valid 10-digit number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await teamDriverApi.create({ firstName: firstName.trim(), lastName: lastName.trim(), phoneNumber: phoneNumber.trim(), email: email.trim() || undefined });
      toast.show('Team driver added', 'success');
      navigation.goBack();
    } catch (e) {
      setErrors((er) => ({ ...er, form: getErrorMessage(e) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input label="First Name" value={firstName} onChangeText={(t) => { setFirstName(t); }} required error={errors.firstName} />
          <Input label="Last Name" value={lastName} onChangeText={setLastName} required error={errors.lastName} />
          <Input label="Phone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" prefix="+91" required error={errors.phoneNumber} />
          <Input label="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Button title="Save Team Driver" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
