import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { chatApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Icon, IconButton, EmptyState, useToast } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';
import type { ChatMessage } from '../../types';

type Route = RouteProp<DriverStackParamList, 'Chat'>;

function dateLabel(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeLabel(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatScreen() {
  const { params } = useRoute<Route>();
  const { user } = useAuth();
  const toast = useToast();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    chatApi
      .getMessages(params.conversationId)
      .then((res) => setMessages([...res.data.data].reverse()))
      .finally(() => setLoading(false));
  }, [params.conversationId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText('');
    const optimistic: ChatMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: params.conversationId,
      senderId: user?._id ?? '',
      message: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await chatApi.sendMessage(params.conversationId, trimmed);
      load();
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setText(trimmed);
      toast.show('Message failed to send', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        {!loading && messages.length === 0 ? (
          <EmptyState icon="chatbubble-outline" title="Say hello" message="Send the first message to start this conversation." />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item, index }) => {
              const mine = item.senderId === user?._id;
              const prev = messages[index - 1];
              const showDate = !prev || new Date(prev.createdAt ?? 0).toDateString() !== new Date(item.createdAt ?? 0).toDateString();
              return (
                <View>
                  {showDate && (
                    <View style={styles.dateWrap}>
                      <Text style={styles.dateText}>{dateLabel(item.createdAt)}</Text>
                    </View>
                  )}
                  <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
                    <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                      <Text style={[styles.bubbleText, mine && styles.mineText]}>{item.message}</Text>
                    </View>
                  </View>
                  <View style={[styles.metaRow, mine ? styles.rowMine : styles.rowTheirs]}>
                    <Text style={styles.timeText}>{timeLabel(item.createdAt)}</Text>
                    {mine && (
                      <Icon
                        name={item.readAt ? 'checkmark-done' : 'checkmark'}
                        size={13}
                        color={item.readAt ? colors.primary : colors.textTertiary}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
        <View style={styles.composer}>
          <IconButton name="attach-outline" onPress={() => toast.show('Attachments are coming soon', 'info')} color={colors.textSecondary} accessibilityLabel="Attach file" />
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Type a message…"
              placeholderTextColor={colors.textTertiary}
              multiline
              accessibilityLabel="Message"
            />
          </View>
          <IconButton
            name="send"
            onPress={send}
            color={colors.white}
            background={text.trim() ? colors.primary : colors.disabledBg}
            accessibilityLabel="Send message"
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, flexGrow: 1 },
  dateWrap: { alignItems: 'center', marginVertical: spacing.sm },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.neutralSurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  bubbleRow: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    marginBottom: 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mine: { backgroundColor: colors.primary, borderColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { borderBottomLeftRadius: 4 },
  bubbleText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  mineText: { color: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  timeText: { ...typography.caption, color: colors.textTertiary },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  inputBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    maxHeight: 100,
    justifyContent: 'center',
  },
  textInput: { fontSize: 15, color: colors.text, paddingVertical: 9, maxHeight: 90 },
});
