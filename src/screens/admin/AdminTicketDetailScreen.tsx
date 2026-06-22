import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { ticketApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { Screen, Card, Row, Button, Badge } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Ticket } from '../../types';

type Route = RouteProp<AdminStackParamList, 'TicketDetail'>;

const statuses = ['open', 'in_progress', 'resolved', 'closed'];

export default function AdminTicketDetailScreen() {
  const { params } = useRoute<Route>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => ticketApi.getOne(params.ticketId).then((res) => setTicket(res.data.data));

  useFocusEffect(useCallback(() => { load().catch(() => {}); }, [params.ticketId]));

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      await ticketApi.updateStatus(params.ticketId, status, `Updated to ${status} by admin`);
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return <Screen><></></Screen>;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Badge label={ticket.status} />
          <Text style={styles.subject}>{ticket.subject}</Text>
          <Text style={styles.desc}>{ticket.description}</Text>
          {ticket.raisedByUser && (
            <Row label="Raised By" value={`${ticket.raisedByUser.firstName} ${ticket.raisedByUser.lastName}`} />
          )}
          {ticket.adminNotes && <Row label="Admin Notes" value={ticket.adminNotes} />}
        </Card>
        <Text style={styles.section}>Update Status</Text>
        {statuses.map((s) => (
          <Button
            key={s}
            title={s.replace('_', ' ').toUpperCase()}
            variant={ticket.status === s ? 'primary' : 'outline'}
            onPress={() => updateStatus(s)}
            loading={loading}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40 },
  subject: { fontSize: 18, fontWeight: '700', color: colors.text, marginVertical: spacing.sm },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginVertical: spacing.md },
});
