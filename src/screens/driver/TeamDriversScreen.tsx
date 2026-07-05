import React, { useMemo, useState } from 'react';
import { FlatList, Alert, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { teamDriverApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, EmptyState, ErrorState, SkeletonList, SearchBar, Button, Avatar, IconButton, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { TeamDriver } from '../../types';

export default function TeamDriversScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const toast = useToast();
  const { items, setItems, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => teamDriverApi.list(page),
  );
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (d) => `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) || d.phoneNumber.includes(q),
    );
  }, [items, query]);

  const remove = (driver: TeamDriver) => {
    Alert.alert('Remove Driver', `Remove ${driver.firstName} ${driver.lastName} from your team?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await teamDriverApi.remove(driver._id);
            setItems((prev) => prev.filter((d) => d._id !== driver._id));
            toast.show('Team driver removed', 'success');
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
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search team drivers" />
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
            <Button title="Add Team Driver" icon="person-add-outline" onPress={() => navigation.navigate('AddTeamDriver')} style={{ marginTop: 0, marginBottom: spacing.md }} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title={query ? 'No matches' : 'No team drivers yet'}
              message={query ? 'Try a different search term.' : 'Add drivers who work under your fleet to assign them to vehicles.'}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Avatar name={`${item.firstName} ${item.lastName}`} size={44} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.muted}>{item.phoneNumber}</Text>
                  {item.email ? <Text style={styles.muted}>{item.email}</Text> : null}
                </View>
                <IconButton name="trash-outline" color={colors.error} background={colors.errorSurface} onPress={() => remove(item)} accessibilityLabel="Remove driver" />
              </View>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: { flex: 1 },
  name: { ...typography.bodyMedium, color: colors.text },
  muted: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
