import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { chatApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Input, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { ChatMessage } from '../../types';

type Route = RouteProp<DriverStackParamList, 'Chat'>;

export default function ChatScreen() {
  const { params } = useRoute<Route>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    chatApi.getMessages(params.conversationId).then((res) => setMessages(res.data.data.reverse()));
  };

  useFocusEffect(useCallback(() => { load(); }, [params.conversationId]));

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await chatApi.sendMessage(params.conversationId, text.trim());
      setText('');
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const mine = item.senderId === user?._id;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.bubbleText, mine && styles.mineText]}>{item.message}</Text>
            </View>
          );
        }}
      />
      <View style={styles.composer}>
        <Input label="" value={text} onChangeText={setText} placeholder="Type a message..." />
        <Button title="Send" onPress={send} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, flexGrow: 1 },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderColor: colors.primary },
  theirs: {},
  bubbleText: { color: colors.text, fontSize: 15 },
  mineText: { color: colors.white },
  composer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});
