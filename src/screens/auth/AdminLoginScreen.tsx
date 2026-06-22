import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AdminLogin'>;

export default function AdminLoginScreen({}: Props) {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('admin@taxisanchalak.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
    } catch (e) {
      Alert.alert('Login Failed', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Admin Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Admin Login" onPress={handleLogin} loading={loading} variant="secondary" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
