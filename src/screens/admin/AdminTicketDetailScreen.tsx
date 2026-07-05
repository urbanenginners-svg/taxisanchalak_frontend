import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { ticketApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { Screen, Card, Row, Button, StatusPill, SectionHeader, Input, Icon, ErrorState, SkeletonList, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { Ticket } from '../../types';

type Route = RouteProp<AdminStackParamList, 'TicketDetail'>;

const STATUS_FLOW = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export default function AdminTicketDetailScreen() {
  const { params } = useRoute<Route>();
  const toast = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    return ticketApi
      .getOne(params.ticketId)
      .then((res) => setTicket(res.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setInitialLoading(false));
  }, [params.ticketId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      await ticketApi.updateStatus(params.ticketId, status, note.trim() || `Marked as ${status.replace('_', ' ')} by admin`);
      setNote('');
      toast.show('Ticket status updated', 'success');
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Screen>
        <SkeletonList count={2} />
      </Screen>
    );
  }

  if (error || !ticket) {
    return (
      <Screen>
        <ErrorState message={error ?? 'Ticket not found'} onRetry={load} />
      </Screen>
    );
  }

  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === ticket.status);

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card variant="elevated">
            <StatusPill status={ticket.status} />
            <Text style={styles.subject}>{ticket.subject}</Text>
            <Text style={styles.desc}>{ticket.description}</Text>
            {ticket.raisedByUser && (
              <Row label="Raised By" value={`${ticket.raisedByUser.firstName} ${ticket.raisedByUser.lastName}`} />
            )}
            {ticket.adminNotes && <Row label="Latest Note" value={ticket.adminNotes} />}
          </Card>

          <SectionHeader title="Progress" />
          <Card>
            <View style={styles.timeline}>
              {STATUS_FLOW.map((s, idx) => {
                const done = idx <= currentIndex;
                const leftDone = idx > 0 && idx - 1 < currentIndex;
                const rightDone = idx < currentIndex;
                return (
                  <View key={s.key} style={styles.timelineItem}>
                    <View style={styles.timelineMarkerRow}>
                      <View style={[styles.timelineLine, idx === 0 && styles.timelineLineHidden, leftDone && styles.timelineLineDone]} />
                      <View style={[styles.timelineDot, done && styles.timelineDotDone]}>
                        {done && <Icon name="checkmark" size={11} color={colors.white} />}
                      </View>
                      <View style={[styles.timelineLine, idx === STATUS_FLOW.length - 1 && styles.timelineLineHidden, rightDone && styles.timelineLineDone]} />
                    </View>
                    <Text style={[styles.timelineLabel, done && styles.timelineLabelDone]}>{s.label}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <SectionHeader title="Update Status" style={{ marginTop: spacing.md }} />
          <Card>
            <Input
              label="Note to driver (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Explain what was done or what's needed next…"
            />
            <View style={styles.statusGrid}>
              {STATUS_FLOW.map((s) => {
                const isCurrent = ticket.status === s.key;
                return (
                  <Button
                    key={s.key}
                    title={isCurrent ? `${s.label} (Current)` : s.label}
                    variant={isCurrent ? 'secondary' : 'outline'}
                    size="sm"
                    disabled={isCurrent}
                    onPress={() => updateStatus(s.key)}
                    loading={loading}
                    fullWidth={false}
                    style={styles.statusButton}
                  />
                );
              })}
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  subject: { ...typography.h3, color: colors.text, marginVertical: spacing.xs },
  desc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  timeline: { flexDirection: 'row' },
  timelineItem: { flex: 1, alignItems: 'center' },
  timelineMarkerRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.neutralSurface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  timelineLine: { flex: 1, height: 2, backgroundColor: colors.border },
  timelineLineHidden: { backgroundColor: 'transparent' },
  timelineLineDone: { backgroundColor: colors.success },
  timelineLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  timelineLabelDone: { color: colors.text, fontWeight: '700' },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  statusButton: { flexGrow: 1 },
});
