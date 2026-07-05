import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ticketApi } from '../../api/services';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, StatusPill, EmptyState, ErrorState, SkeletonList, SearchBar, ChipRow, FilterChip, Icon } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export default function AdminTicketsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { items, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => ticketApi.listAll(page),
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

  const openCount = items.filter((t) => t.status === 'open').length;

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search all tickets" />
        <ChipRow>
          {FILTERS.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
              count={f.key === 'open' ? openCount : undefined}
            />
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
          ListEmptyComponent={
            <EmptyState
              icon="ticket-outline"
              title={query || filter !== 'all' ? 'No matches' : 'No tickets to review'}
              message={query || filter !== 'all' ? 'Try a different search or filter.' : "You're all caught up — no driver tickets right now."}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('TicketDetail', { ticketId: item._id })}>
              <View style={styles.topRow}>
                <StatusPill status={item.status} />
                <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subject: { ...typography.bodyMedium, color: colors.text },
  desc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
});
