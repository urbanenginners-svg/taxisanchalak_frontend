import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { chatApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, EmptyState } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { ChatConversation, User } from '../../types';

function otherParticipant(conv: ChatConversation, myId: string): User | undefined {
  if (conv.participantOneId === myId) return conv.participantTwo;
  return conv.participantOne;
}

export default function ChatListScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  useFocusEffect(useCallback(() => {
    chatApi.listConversations().then((res) => setConversations(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No conversations yet. Start chatting from a driver profile." />}
        renderItem={({ item }) => {
          const other = otherParticipant(item, user?._id ?? '');
          const title = other ? `${other.firstName} ${other.lastName}` : 'Driver';
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat', { conversationId: item._id, title })}
            >
              <Card>
                <Text style={styles.name}>{title}</Text>
                {item.lastMessageAt && (
                  <Text style={styles.muted}>Last message: {new Date(item.lastMessageAt).toLocaleString()}</Text>
                )}
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  muted: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
