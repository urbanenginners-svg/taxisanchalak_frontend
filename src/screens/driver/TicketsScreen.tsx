import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ticketApi } from '../../api/services';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Badge, EmptyState, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Ticket } from '../../types';

export default function TicketsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useFocusEffect(useCallback(() => {
    ticketApi.listMy().then((res) => setTickets(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button title="+ Raise Ticket" onPress={() => navigation.navigate('CreateTicket', {})} />
        }
        ListEmptyComponent={<EmptyState message="No tickets raised" />}
        renderItem={({ item }) => (
          <Card>
            <Badge label={item.status} />
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          </Card>
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
