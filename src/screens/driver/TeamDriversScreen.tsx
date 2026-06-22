import React, { useCallback, useState } from 'react';
import { FlatList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Badge, EmptyState, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { TeamDriver } from '../../types';

export default function TeamDriversScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [drivers, setDrivers] = useState<TeamDriver[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await teamDriverApi.list();
      setDrivers(res.data.data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const remove = (id: string) => {
    Alert.alert('Remove Driver', 'Remove this team driver?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await teamDriverApi.remove(id);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button title="+ Add Team Driver" onPress={() => navigation.navigate('AddTeamDriver')} />
        }
        ListEmptyComponent={!loading ? <EmptyState message="No team drivers yet" /> : null}
        renderItem={({ item }) => (
          <Card>
            <Badge label="Team Driver" color={colors.header} />
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.muted}>{item.phoneNumber}</Text>
            {item.email ? <Text style={styles.muted}>{item.email}</Text> : null}
            <TouchableOpacity onPress={() => remove(item._id)} style={styles.remove}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
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
  remove: { marginTop: spacing.sm },
  removeText: { color: colors.error, fontWeight: '600' },
});
