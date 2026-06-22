import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

export default function AddTeamDriverScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await teamDriverApi.create({ firstName, lastName, phoneNumber, email: email || undefined });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="First Name" value={firstName} onChangeText={setFirstName} />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} />
        <Input label="Phone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <Input label="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Button title="Save Team Driver" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
