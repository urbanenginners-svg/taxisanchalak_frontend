import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

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
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    setLoading(true);
    try {
      await registerDriver(form);
    } catch (e) {
      Alert.alert('Registration Failed', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="First Name" value={form.firstName} onChangeText={set('firstName')} />
        <Input label="Last Name" value={form.lastName} onChangeText={set('lastName')} />
        <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
        <Input label="Phone" value={form.phoneNumber} onChangeText={set('phoneNumber')} keyboardType="phone-pad" />
        <Input label="Date of Birth (YYYY-MM-DD)" value={form.dateOfBirth} onChangeText={set('dateOfBirth')} />
        <Input label="Address" value={form.address} onChangeText={set('address')} />
        <Input label="State" value={form.state} onChangeText={set('state')} />
        <Input label="City" value={form.city} onChangeText={set('city')} />
        <Input label="Password" value={form.password} onChangeText={set('password')} secureTextEntry />
        <Button title="Create Account" onPress={handleRegister} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, paddingBottom: 40 } });
