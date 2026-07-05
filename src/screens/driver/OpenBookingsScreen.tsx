import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { bookingApi } from '../../api/services';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, StatusPill, EmptyState, ErrorState, SkeletonList, SearchBar, Icon } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';
import type { Booking } from '../../types';

function isCustomerHidden(booking: Booking) {
  return booking.customer.phoneNumber === 'Hidden';
}

function BookingCard({ item, onPress }: { item: Booking; onPress: () => void }) {
  const hidden = isCustomerHidden(item);
  return (
    <Card onPress={onPress} accessibilityLabel={`${item.fromLocation} to ${item.toLocation}`}>
      <View style={styles.cardTop}>
        <StatusPill status={item.status} />
        <Text style={styles.fare}>₹{item.actualPrice.toLocaleString('en-IN')}</Text>
      </View>
      <View style={styles.routeRow}>
        <Text style={styles.route} numberOfLines={1}>{item.fromLocation}</Text>
        <Icon name="arrow-forward" size={15} color={colors.textTertiary} style={{ marginHorizontal: 6 }} />
        <Text style={styles.route} numberOfLines={1}>{item.toLocation}</Text>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="cash-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>Commission ₹{item.commission.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name={hidden ? 'lock-closed-outline' : 'person-outline'} size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{hidden ? 'Customer locked' : item.customer.name}</Text>
        </View>
      </View>
    </Card>
  );
}

function useFilteredBookings(items: Booking[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (b) =>
        b.fromLocation.toLowerCase().includes(q) ||
        b.toLocation.toLowerCase().includes(q) ||
        b.customer.name.toLowerCase().includes(q),
    );
  }, [items, query]);
}

function BookingListScreen({
  fetchPage,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  searchPlaceholder,
  mode,
}: {
  fetchPage: (page: number) => ReturnType<typeof bookingApi.listOpen>;
  emptyIcon: React.ComponentProps<typeof Icon>['name'];
  emptyTitle: string;
  emptyMessage: string;
  searchPlaceholder: string;
  mode: 'open' | 'my' | 'accepted';
}) {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const { items, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(fetchPage);
  const [query, setQuery] = useState('');
  const filtered = useFilteredBookings(items, query);

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
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
            query ? (
              <EmptyState icon="search-outline" title="No matches" message="Try a different search term." />
            ) : (
              <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
            )
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <BookingCard item={item} onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id, mode })} />
          )}
        />
      )}
    </Screen>
  );
}

export default function OpenBookingsScreen() {
  return (
    <BookingListScreen
      fetchPage={(page) => bookingApi.listOpen(page)}
      emptyIcon="search-outline"
      emptyTitle="No open rides"
      emptyMessage="There are no open rides from other drivers right now. Check back soon."
      searchPlaceholder="Search by route or customer"
      mode="open"
    />
  );
}

export function MyBookingsScreen() {
  return (
    <BookingListScreen
      fetchPage={(page) => bookingApi.listMy(page)}
      emptyIcon="megaphone-outline"
      emptyTitle="No posted rides yet"
      emptyMessage="Rides you post will show up here so you can track requests."
      searchPlaceholder="Search your posted rides"
      mode="my"
    />
  );
}

export function MyAcceptedBookingsScreen() {
  return (
    <BookingListScreen
      fetchPage={(page) => bookingApi.listMyAccepted(page)}
      emptyIcon="checkmark-done-outline"
      emptyTitle="No accepted rides yet"
      emptyMessage="Rides you accept from other drivers will appear here."
      searchPlaceholder="Search accepted rides"
      mode="accepted"
    />
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fare: { ...typography.h3, color: colors.text },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  route: { ...typography.bodyMedium, color: colors.text, flexShrink: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { ...typography.bodySmall, color: colors.textSecondary },
});
