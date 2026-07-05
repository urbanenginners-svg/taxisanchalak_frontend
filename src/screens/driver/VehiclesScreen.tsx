import React, { useMemo, useState } from 'react';
import { FlatList, Alert, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { vehicleApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, EmptyState, ErrorState, SkeletonList, SearchBar, Button, Icon, IconButton, StatusPill, useToast } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';
import type { Vehicle } from '../../types';

export default function VehiclesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const toast = useToast();
  const { items, setItems, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => vehicleApi.list(page),
  );
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (v) => v.carName.toLowerCase().includes(q) || v.vehicleNumber.toLowerCase().includes(q) || v.manufacturerName.toLowerCase().includes(q),
    );
  }, [items, query]);

  const remove = (vehicle: Vehicle) => {
    Alert.alert('Remove Vehicle', `Remove ${vehicle.carName} (${vehicle.vehicleNumber}) from your fleet?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await vehicleApi.remove(vehicle._id);
            setItems((prev) => prev.filter((v) => v._id !== vehicle._id));
            toast.show('Vehicle removed', 'success');
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search vehicles" />
      </View>
      {loading ? (
        <SkeletonList count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListHeaderComponent={
            <Button title="Add Vehicle" icon="add-circle-outline" onPress={() => navigation.navigate('AddVehicle')} style={{ marginTop: 0, marginBottom: spacing.md }} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="car-outline"
              title={query ? 'No matches' : 'No vehicles registered'}
              message={query ? 'Try a different search term.' : 'Register the vehicles in your fleet to assign drivers to them.'}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.topRow}>
                <View style={styles.plate}>
                  <Text style={styles.plateText}>{item.vehicleNumber}</Text>
                </View>
                <IconButton name="trash-outline" color={colors.error} background={colors.errorSurface} onPress={() => remove(item)} accessibilityLabel="Remove vehicle" />
              </View>
              <Text style={styles.name}>{item.carName}</Text>
              <Text style={styles.muted}>{item.manufacturerName} · {item.registrationYear}</Text>
              {item.assignedDriver ? (
                <StatusPill tone="success" label={`Driver: ${item.assignedDriver.firstName} ${item.assignedDriver.lastName}`} />
              ) : (
                <StatusPill tone="neutral" label="Unassigned" />
              )}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  list: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  plate: {
    backgroundColor: colors.text,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  plateText: { color: colors.white, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  name: { ...typography.h3, color: colors.text },
  muted: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm },
});
