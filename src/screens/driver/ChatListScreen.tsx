import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { chatApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Screen, Card, EmptyState, ErrorState, SkeletonList, SearchBar, Avatar } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { ChatConversation, User } from '../../types';

function otherParticipant(conv: ChatConversation, myId: string): User | undefined {
  if (conv.participantOneId === myId) return conv.participantTwo;
  return conv.participantOne;
}

function formatWhen(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function ChatListScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const { items, loading, refreshing, refresh, error, load, loadMore, loadingMore } = usePaginatedList(
    (page) => chatApi.listConversations(page),
  );
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => {
      const other = otherParticipant(c, user?._id ?? '');
      const name = other ? `${other.firstName ?? ''} ${other.lastName ?? ''}`.toLowerCase() : '';
      return name.includes(q);
    });
  }, [items, query, user?._id]);

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search conversations" />
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
              icon="chatbubble-ellipses-outline"
              title={query ? 'No matches' : 'No conversations yet'}
              message={query ? 'Try a different search term.' : 'Conversations you start from a booking or driver profile will show up here.'}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: spacing.md }} color={colors.primary} /> : null}
          renderItem={({ item }) => {
            const other = otherParticipant(item, user?._id ?? '');
            const title = other ? `${other.firstName ?? ''} ${other.lastName ?? ''}`.trim() : 'Driver';
            return (
              <Card onPress={() => navigation.navigate('Chat', { conversationId: item._id, title })}>
                <View style={styles.row}>
                  <Avatar name={title} size={44} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{title}</Text>
                    <Text style={styles.muted} numberOfLines={1}>
                      {item.lastMessageAt ? 'Tap to continue the conversation' : 'No messages yet'}
                    </Text>
                  </View>
                  {item.lastMessageAt ? <Text style={styles.time}>{formatWhen(item.lastMessageAt)}</Text> : null}
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
  time: { ...typography.caption, color: colors.textTertiary },
});
