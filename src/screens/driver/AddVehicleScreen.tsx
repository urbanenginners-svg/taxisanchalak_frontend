import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vehicleApi, teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { TeamDriver } from '../../types';

export default function AddVehicleScreen() {
  const navigation = useNavigation();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [carName, setCarName] = useState('');
  const [registrationYear, setRegistrationYear] = useState('2020');
  const [manufacturerName, setManufacturerName] = useState('');
  const [teamDrivers, setTeamDrivers] = useState<TeamDriver[]>([]);
  const [assignedTeamDriverId, setAssignedTeamDriverId] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    teamDriverApi.list().then((res) => setTeamDrivers(res.data.data)).catch(() => {});
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      await vehicleApi.create({
        vehicleNumber,
        carName,
        registrationYear: Number(registrationYear),
        manufacturerName,
        assignedTeamDriverId,
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
        <Input label="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} placeholder="DL01AB1234" />
        <Input label="Car Name" value={carName} onChangeText={setCarName} placeholder="Swift Dzire" />
        <Input label="Registration Year" value={registrationYear} onChangeText={setRegistrationYear} keyboardType="numeric" />
        <Input label="Manufacturer" value={manufacturerName} onChangeText={setManufacturerName} placeholder="Maruti" />
        <Text style={styles.label}>Assign Team Driver (optional)</Text>
        {teamDrivers.map((d) => (
          <TouchableOpacity
            key={d._id}
            style={[styles.option, assignedTeamDriverId === d._id && styles.optionSelected]}
            onPress={() => setAssignedTeamDriverId(d._id)}
          >
            <Text>{d.firstName} {d.lastName} · {d.phoneNumber}</Text>
          </TouchableOpacity>
        ))}
        <Button title="Register Vehicle" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#FFF8E7' },
});
