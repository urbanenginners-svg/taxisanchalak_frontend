import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bookingApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { INDIAN_CITY_OPTIONS, cityById } from '../../data/indianCities';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, SectionHeader, SelectField, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

type PostBookingForm = {
  fromCityId: string;
  toCityId: string;
  actualPrice: string;
  commission: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
};

export default function PostBookingScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const cityOptions = useMemo(() => INDIAN_CITY_OPTIONS, []);

  const form = useFormValidation<PostBookingForm>(
    {
      fromCityId: '',
      toCityId: '',
      actualPrice: '',
      commission: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      notes: '',
    },
    {
      fromCityId: [validators.required('Select origin city')],
      toCityId: [
        validators.required('Select destination city'),
        (value, values) =>
          value && values.fromCityId && value === values.fromCityId
            ? 'Destination must be different from origin'
            : undefined,
      ],
      actualPrice: [validators.required('Fare is required'), validators.positiveNumber('Enter a valid fare')],
      commission: [
        validators.required('Commission is required'),
        validators.nonNegativeNumber('Enter a valid commission'),
        (value, values) => {
          const fare = Number(values.actualPrice);
          const comm = Number(value);
          if (!Number.isNaN(fare) && !Number.isNaN(comm) && comm > fare) {
            return 'Commission cannot exceed fare';
          }
          return undefined;
        },
      ],
      customerName: [validators.required('Customer name is required')],
      customerPhone: [validators.required('Phone is required'), validators.phone()],
      customerEmail: [validators.email()],
    },
  );

  const submit = async () => {
    setFormError('');
    if (!form.validateAll()) return;

    const fromCity = cityById(form.values.fromCityId);
    const toCity = cityById(form.values.toCityId);
    if (!fromCity || !toCity) return;

    setLoading(true);
    try {
      await bookingApi.create({
        fromLocation: fromCity.name,
        toLocation: toCity.name,
        actualPrice: Number(form.values.actualPrice),
        commission: Number(form.values.commission),
        customer: {
          name: form.values.customerName.trim(),
          phoneNumber: form.values.customerPhone.trim(),
          email: form.values.customerEmail.trim() || undefined,
          notes: form.values.notes.trim() || undefined,
        },
      });
      toast.show('Ride posted successfully', 'success');
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
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <SectionHeader title="Route" />
          <SelectField
            label="From"
            value={form.values.fromCityId || undefined}
            onSelect={(id) => {
              form.setValue('fromCityId', id);
              if (form.touched.toCityId) form.blur('toCityId');
            }}
            onBlur={() => form.blur('fromCityId')}
            options={cityOptions}
            placeholder="Select origin city"
            searchPlaceholder="Search city or state"
            searchable
            required
            error={form.fieldError('fromCityId')}
          />
          <SelectField
            label="To"
            value={form.values.toCityId || undefined}
            onSelect={(id) => form.setValue('toCityId', id)}
            onBlur={() => form.blur('toCityId')}
            options={cityOptions}
            placeholder="Select destination city"
            searchPlaceholder="Search city or state"
            searchable
            required
            error={form.fieldError('toCityId')}
          />

          <SectionHeader title="Pricing" style={{ marginTop: spacing.sm }} />
          <Input
            label="Actual Fare (₹)"
            value={form.values.actualPrice}
            onChangeText={(t) => {
              form.setValue('actualPrice', t);
              if (form.touched.commission) form.blur('commission');
            }}
            onBlur={() => form.blur('actualPrice')}
            keyboardType="numeric"
            required
            error={form.fieldError('actualPrice')}
            placeholder="10000"
          />
          <Input
            label="Commission for Accepting Driver (₹)"
            value={form.values.commission}
            onChangeText={(t) => form.setValue('commission', t)}
            onBlur={() => form.blur('commission')}
            keyboardType="numeric"
            required
            error={form.fieldError('commission')}
            placeholder="1000"
            helperText={!form.fieldError('commission') ? 'Paid by the driver who accepts this ride' : undefined}
          />

          <SectionHeader title="Customer" style={{ marginTop: spacing.sm }} />
          <Input
            label="Customer Name"
            value={form.values.customerName}
            onChangeText={(t) => form.setValue('customerName', t)}
            onBlur={() => form.blur('customerName')}
            required
            error={form.fieldError('customerName')}
          />
          <Input
            label="Customer Phone"
            value={form.values.customerPhone}
            onChangeText={(t) => form.setValue('customerPhone', t)}
            onBlur={() => form.blur('customerPhone')}
            keyboardType="phone-pad"
            prefix="+91"
            required
            error={form.fieldError('customerPhone')}
            helperText={!form.fieldError('customerPhone') ? 'Hidden from other drivers until commission is paid' : undefined}
          />
          <Input
            label="Customer Email (optional)"
            value={form.values.customerEmail}
            onChangeText={(t) => form.setValue('customerEmail', t)}
            onBlur={() => form.blur('customerEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={form.fieldError('customerEmail')}
          />
          <Input label="Notes (optional)" value={form.values.notes} onChangeText={(t) => form.setValue('notes', t)} multiline placeholder="Pickup instructions, luggage, timing…" />

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
