import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ticketApi } from '../../api/services';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, StatusPill, EmptyState, ErrorState, SkeletonList, SearchBar, Button, ChipRow, FilterChip } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { Ticket } from '../../types';

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export default function TicketsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const { items, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => ticketApi.listMy(page),
  );
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== 'all') list = list.filter((t) => t.status === filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((t) => t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    return list;
  }, [items, query, filter]);

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search your tickets" />
        <ChipRow>
          {FILTERS.map((f) => (
            <FilterChip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
          ))}
        </ChipRow>
      </View>
      {loading ? (
        <SkeletonList />
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
            <Button title="Raise a Ticket" icon="add-circle-outline" onPress={() => navigation.navigate('CreateTicket', {})} style={{ marginTop: 0, marginBottom: spacing.md }} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="help-buoy-outline"
              title={query || filter !== 'all' ? 'No matches' : 'No tickets raised'}
              message={query || filter !== 'all' ? 'Try a different search or filter.' : 'Facing an issue with a ride or customer? Raise a ticket and our team will help.'}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <Card>
              <StatusPill status={item.status} />
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
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
  subject: { ...typography.bodyMedium, color: colors.text },
  desc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
});
