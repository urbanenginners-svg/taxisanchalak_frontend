import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bookingApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, SectionHeader, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export default function PostBookingScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [fromLocation, setFrom] = useState('');
  const [toLocation, setTo] = useState('');
  const [actualPrice, setPrice] = useState('');
  const [commission, setCommission] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clearError = (key: string) => errors[key] && setErrors((e) => ({ ...e, [key]: '' }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fromLocation.trim()) next.from = 'Required';
    if (!toLocation.trim()) next.to = 'Required';
    if (!actualPrice || Number(actualPrice) <= 0) next.price = 'Enter a valid fare';
    if (!commission || Number(commission) < 0) next.commission = 'Enter a valid commission';
    if (Number(commission) > Number(actualPrice || 0)) next.commission = 'Commission cannot exceed fare';
    if (!customerName.trim()) next.customerName = 'Required';
    if (!customerPhone.trim() || customerPhone.trim().length < 10) next.customerPhone = 'Enter a valid 10-digit number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await bookingApi.create({
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        actualPrice: Number(actualPrice),
        commission: Number(commission),
        customer: {
          name: customerName.trim(),
          phoneNumber: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });
      toast.show('Ride posted successfully', 'success');
      navigation.goBack();
    } catch (e) {
      setErrors((e2) => ({ ...e2, form: getErrorMessage(e) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

          <SectionHeader title="Route" />
          <Input label="From" value={fromLocation} onChangeText={(t) => { setFrom(t); clearError('from'); }} placeholder="e.g. Delhi" required error={errors.from} leftIcon="radio-button-on-outline" />
          <Input label="To" value={toLocation} onChangeText={(t) => { setTo(t); clearError('to'); }} placeholder="e.g. Chandigarh" required error={errors.to} leftIcon="location-outline" />

          <SectionHeader title="Pricing" style={{ marginTop: spacing.sm }} />
          <Input label="Actual Fare (₹)" value={actualPrice} onChangeText={(t) => { setPrice(t); clearError('price'); }} keyboardType="numeric" required error={errors.price} placeholder="10000" />
          <Input label="Commission for Accepting Driver (₹)" value={commission} onChangeText={(t) => { setCommission(t); clearError('commission'); }} keyboardType="numeric" required error={errors.commission} placeholder="1000" helperText={!errors.commission ? 'Paid by the driver who accepts this ride' : undefined} />

          <SectionHeader title="Customer" style={{ marginTop: spacing.sm }} />
          <Input label="Customer Name" value={customerName} onChangeText={(t) => { setCustomerName(t); clearError('customerName'); }} required error={errors.customerName} />
          <Input label="Customer Phone" value={customerPhone} onChangeText={(t) => { setCustomerPhone(t); clearError('customerPhone'); }} keyboardType="phone-pad" prefix="+91" required error={errors.customerPhone} helperText={!errors.customerPhone ? 'Hidden from other drivers until commission is paid' : undefined} />
          <Input label="Customer Email (optional)" value={customerEmail} onChangeText={setCustomerEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Notes (optional)" value={notes} onChangeText={setNotes} multiline placeholder="Pickup instructions, luggage, timing…" />

          <Button title="Publish Ride" icon="megaphone-outline" onPress={submit} loading={loading} style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  formError: { ...typography.bodySmallMedium, color: colors.error, marginBottom: spacing.md },
});
