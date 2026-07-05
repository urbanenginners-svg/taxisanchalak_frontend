import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { adminApi } from '../../api/services';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, EmptyState, ErrorState, SkeletonList, SearchBar, Avatar, StatusPill } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

function roleLabel(user: { role?: { name: string; slug: string } | string }) {
  if (!user.role) return 'Unknown';
  if (typeof user.role === 'string') return user.role;
  return user.role.name;
}

export default function AdminUsersScreen() {
  const { items, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => adminApi.listUsers(page),
  );
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (u) => `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(q) || (u.email ?? '').toLowerCase().includes(q) || (u.phoneNumber ?? '').includes(q),
    );
  }, [items, query]);

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search users" />
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
            <EmptyState icon="people-outline" title={query ? 'No matches' : 'No users found'} message={query ? 'Try a different search term.' : 'Registered drivers and admins will appear here.'} />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => {
            const name = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || 'Unnamed User';
            return (
              <Card>
                <View style={styles.row}>
                  <Avatar name={name} size={44} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.muted}>{item.email ?? item.phoneNumber ?? '—'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <StatusPill tone="primary" label={roleLabel(item)} />
                    <StatusPill tone={item.isActive === false ? 'neutral' : 'success'} label={item.isActive === false ? 'Inactive' : 'Active'} />
                  </View>
                </View>
              </Card>
            );
          }}
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
