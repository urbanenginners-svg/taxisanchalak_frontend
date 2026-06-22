import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { adminApi } from '../../api/services';
import { Screen, Card, EmptyState } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { User } from '../../types';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

  useFocusEffect(useCallback(() => {
    adminApi.listUsers().then((res) => setUsers(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No users found" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.muted}>{item.email}</Text>
            <Text style={styles.muted}>{item.phoneNumber}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  muted: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
