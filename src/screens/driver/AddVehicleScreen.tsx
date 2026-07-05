import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vehicleApi, teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button, SelectField, useToast } from '../../components/ui';
import { spacing } from '../../theme';
import type { TeamDriver } from '../../types';

const CURRENT_YEAR = new Date().getFullYear();

export default function AddVehicleScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [carName, setCarName] = useState('');
  const [registrationYear, setRegistrationYear] = useState(String(CURRENT_YEAR));
  const [manufacturerName, setManufacturerName] = useState('');
  const [teamDrivers, setTeamDrivers] = useState<TeamDriver[]>([]);
  const [assignedTeamDriverId, setAssignedTeamDriverId] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    teamDriverApi.list().then((res) => setTeamDrivers(res.data.data)).catch(() => {});
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!vehicleNumber.trim()) next.vehicleNumber = 'Required';
    if (!carName.trim()) next.carName = 'Required';
    if (!manufacturerName.trim()) next.manufacturerName = 'Required';
    const year = Number(registrationYear);
    if (!year || year < 1980 || year > CURRENT_YEAR) next.registrationYear = `Enter a year between 1980–${CURRENT_YEAR}`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await vehicleApi.create({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        carName: carName.trim(),
        registrationYear: Number(registrationYear),
        manufacturerName: manufacturerName.trim(),
        assignedTeamDriverId,
      });
      toast.show('Vehicle registered', 'success');
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
          <Input label="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} placeholder="DL01AB1234" autoCapitalize="characters" required error={errors.vehicleNumber} />
          <Input label="Car Name" value={carName} onChangeText={setCarName} placeholder="Swift Dzire" required error={errors.carName} />
          <Input label="Registration Year" value={registrationYear} onChangeText={setRegistrationYear} keyboardType="numeric" required error={errors.registrationYear} />
          <Input label="Manufacturer" value={manufacturerName} onChangeText={setManufacturerName} placeholder="Maruti Suzuki" required error={errors.manufacturerName} />
          <SelectField
            label="Assign Team Driver (optional)"
            value={assignedTeamDriverId}
            onSelect={setAssignedTeamDriverId}
            options={teamDrivers.map((d) => ({ id: d._id, title: `${d.firstName} ${d.lastName}`, subtitle: d.phoneNumber }))}
            emptyMessage="Add a team driver first from the Fleet tab, then assign them here."
          />
          <Button title="Register Vehicle" onPress={submit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, paddingBottom: spacing.xxxl } });
