import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ticketApi } from '../../api/services';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { Screen, Card, Badge, EmptyState } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Ticket } from '../../types';

export default function AdminTicketsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useFocusEffect(useCallback(() => {
    ticketApi.listAll().then((res) => setTickets(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No tickets to review" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TicketDetail', { ticketId: item._id })}>
            <Card>
              <Badge label={item.status} color={item.status === 'open' ? colors.warning : colors.success} />
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  subject: { fontSize: 16, fontWeight: '700', color: colors.text },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
