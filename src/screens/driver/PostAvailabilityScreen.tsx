import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { taxiApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

export default function PostAvailabilityScreen() {
  const navigation = useNavigation();
  const [fromLocation, setFrom] = useState('');
  const [toLocation, setTo] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await taxiApi.create({
        fromLocation,
        toLocation: toLocation || undefined,
        availableFrom: new Date().toISOString(),
        description: description || undefined,
      });
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
        <Input label="From Location" value={fromLocation} onChangeText={setFrom} />
        <Input label="To Location (optional)" value={toLocation} onChangeText={setTo} />
        <Input label="Description" value={description} onChangeText={setDescription} multiline />
        <Button title="Post Availability" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
