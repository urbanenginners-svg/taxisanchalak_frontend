import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { taxiApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export default function PostAvailabilityScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [fromLocation, setFrom] = useState('');
  const [toLocation, setTo] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!fromLocation.trim()) {
      setError('From location is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await taxiApi.create({
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim() || undefined,
        availableFrom: new Date().toISOString(),
        description: description.trim() || undefined,
      });
      toast.show('Availability posted', 'success');
      navigation.goBack();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>Let other drivers on the network know your taxi is free and where.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Input label="From Location" value={fromLocation} onChangeText={setFrom} placeholder="e.g. Connaught Place, Delhi" required leftIcon="radio-button-on-outline" />
          <Input label="To Location (optional)" value={toLocation} onChangeText={setTo} placeholder="e.g. Chandigarh" leftIcon="location-outline" />
          <Input label="Description (optional)" value={description} onChangeText={setDescription} multiline placeholder="Vehicle type, seating, timing preferences…" />
          <Button title="Post Availability" icon="navigate-circle-outline" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  hint: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  error: { ...typography.bodySmallMedium, color: colors.error, marginBottom: spacing.md },
});
