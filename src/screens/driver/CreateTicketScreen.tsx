import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ticketApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type Route = RouteProp<DriverStackParamList, 'CreateTicket'>;
type TicketForm = { subject: string; description: string };

export default function CreateTicketScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const toast = useToast();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<TicketForm>(
    { subject: '', description: '' },
    {
      subject: [validators.required('Subject is required')],
      description: [
        validators.required('Description is required'),
        validators.minLength(10, 'Please describe the issue in at least 10 characters'),
      ],
    },
  );

  const submit = async () => {
    setFormError('');
    if (!form.validateAll()) return;
    setLoading(true);
    try {
      await ticketApi.create({
        bookingId: params?.bookingId,
        subject: form.values.subject.trim(),
        description: form.values.description.trim(),
      });
      toast.show('Ticket submitted — our team will review it', 'success');
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
          <Text style={styles.hint}>Tell us what happened. Our support team typically responds within 24 hours.</Text>
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          <Input
            label="Subject"
            value={form.values.subject}
            onChangeText={(t) => form.setValue('subject', t)}
            onBlur={() => form.blur('subject')}
            placeholder="e.g. Customer not paying"
            required
            error={form.fieldError('subject')}
          />
          <Input
            label="Description"
            value={form.values.description}
            onChangeText={(t) => form.setValue('description', t)}
            onBlur={() => form.blur('description')}
            multiline
            placeholder="Add ride details, dates and any other context…"
            required
            error={form.fieldError('description')}
          />
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
