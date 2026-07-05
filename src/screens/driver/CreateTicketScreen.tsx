import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ticketApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Input, Button, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type Route = RouteProp<DriverStackParamList, 'CreateTicket'>;

export default function CreateTicketScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!subject.trim()) next.subject = 'Required';
    if (!description.trim() || description.trim().length < 10) next.description = 'Please describe the issue in at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await ticketApi.create({ bookingId: params?.bookingId, subject: subject.trim(), description: description.trim() });
      toast.show('Ticket submitted — our team will review it', 'success');
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
          <Text style={styles.hint}>Tell us what happened. Our support team typically responds within 24 hours.</Text>
          {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}
          <Input label="Subject" value={subject} onChangeText={setSubject} placeholder="e.g. Customer not paying" required error={errors.subject} />
          <Input label="Description" value={description} onChangeText={setDescription} multiline placeholder="Add ride details, dates and any other context…" required error={errors.description} />
          <Button title="Submit Ticket" icon="send-outline" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  hint: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  formError: { ...typography.bodySmallMedium, color: colors.error, marginBottom: spacing.md },
});
