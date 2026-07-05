import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vehicleApi, teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validators } from '../../utils/validation';
import { Screen, Input, Button, SelectField, useToast } from '../../components/ui';
import { spacing, typography, colors } from '../../theme';
import type { TeamDriver } from '../../types';

const CURRENT_YEAR = new Date().getFullYear();

type VehicleForm = {
  vehicleNumber: string;
  carName: string;
  registrationYear: string;
  manufacturerName: string;
  assignedTeamDriverId: string;
};

export default function AddVehicleScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [teamDrivers, setTeamDrivers] = useState<TeamDriver[]>([]);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<VehicleForm>(
    {
      vehicleNumber: '',
      carName: '',
      registrationYear: String(CURRENT_YEAR),
      manufacturerName: '',
      assignedTeamDriverId: '',
    },
    {
      vehicleNumber: [validators.required('Vehicle number is required')],
      carName: [validators.required('Car name is required')],
      manufacturerName: [validators.required('Manufacturer is required')],
      registrationYear: [
        validators.required('Registration year is required'),
        validators.yearRange(1980, CURRENT_YEAR),
      ],
    },
  );

  useEffect(() => {
    teamDriverApi.list().then((res) => setTeamDrivers(res.data.data)).catch(() => {});
  }, []);

  const submit = async () => {
    setFormError('');
    if (!form.validateAll()) return;
    setLoading(true);
    try {
      await vehicleApi.create({
        vehicleNumber: form.values.vehicleNumber.trim().toUpperCase(),
        carName: form.values.carName.trim(),
        registrationYear: Number(form.values.registrationYear),
        manufacturerName: form.values.manufacturerName.trim(),
        assignedTeamDriverId: form.values.assignedTeamDriverId || undefined,
      });
      toast.show('Vehicle registered', 'success');
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
          <Input label="Vehicle Number" value={form.values.vehicleNumber} onChangeText={(t) => form.setValue('vehicleNumber', t)} onBlur={() => form.blur('vehicleNumber')} placeholder="DL01AB1234" autoCapitalize="characters" required error={form.fieldError('vehicleNumber')} />
          <Input label="Car Name" value={form.values.carName} onChangeText={(t) => form.setValue('carName', t)} onBlur={() => form.blur('carName')} placeholder="Swift Dzire" required error={form.fieldError('carName')} />
          <Input label="Registration Year" value={form.values.registrationYear} onChangeText={(t) => form.setValue('registrationYear', t)} onBlur={() => form.blur('registrationYear')} keyboardType="numeric" required error={form.fieldError('registrationYear')} />
          <Input label="Manufacturer" value={form.values.manufacturerName} onChangeText={(t) => form.setValue('manufacturerName', t)} onBlur={() => form.blur('manufacturerName')} placeholder="Maruti Suzuki" required error={form.fieldError('manufacturerName')} />
          <SelectField
            label="Assign Team Driver (optional)"
            value={form.values.assignedTeamDriverId || undefined}
            onSelect={(id) => form.setValue('assignedTeamDriverId', id)}
            options={teamDrivers.map((d) => ({ id: d._id, title: `${d.firstName} ${d.lastName}`, subtitle: d.phoneNumber }))}
            emptyMessage="Add a team driver first from the Fleet tab, then assign them here."
          />
          <Button title="Register Vehicle" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  formError: { ...typography.bodySmallMedium, color: colors.error, marginBottom: spacing.md },
});
