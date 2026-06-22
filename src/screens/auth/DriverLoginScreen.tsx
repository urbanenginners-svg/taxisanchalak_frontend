import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'DriverLogin'>;

export default function DriverLoginScreen({}: Props) {
  const { loginDriver } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await loginDriver(email.trim(), password);
    } catch (e) {
      Alert.alert('Login Failed', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="driver@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" />
        <Button title="Login" onPress={handleLogin} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
