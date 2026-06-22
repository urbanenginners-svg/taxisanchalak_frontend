import React, { useCallback, useState } from 'react';
import { FlatList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { vehicleApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Badge, EmptyState, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Vehicle } from '../../types';

export default function VehiclesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await vehicleApi.list();
      setVehicles(res.data.data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <Screen>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button title="+ Add Vehicle" onPress={() => navigation.navigate('AddVehicle')} />
        }
        ListEmptyComponent={!loading ? <EmptyState message="No vehicles registered" /> : null}
        renderItem={({ item }) => (
          <Card>
            <Badge label={item.vehicleNumber} />
            <Text style={styles.name}>{item.carName}</Text>
            <Text style={styles.muted}>{item.manufacturerName} · {item.registrationYear}</Text>
            {item.assignedDriver ? (
              <Text style={styles.assigned}>
                Driver: {item.assignedDriver.firstName} {item.assignedDriver.lastName}
              </Text>
            ) : (
              <Text style={styles.muted}>No driver assigned</Text>
            )}
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  assigned: { color: colors.success, fontSize: 14, marginTop: 4, fontWeight: '600' },
});
