import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/AuthContext';
import { ticketApi, adminApi } from '../../api/services';
import { Screen, Card, ListItem, Divider, Icon } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<Record<'Dashboard' | 'Tickets' | 'Users' | 'Profile', undefined>, 'Dashboard'>,
  BottomTabNavigationProp<Record<'Dashboard' | 'Tickets' | 'Users' | 'Profile', undefined>>
>;

export default function AdminHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [stats, setStats] = useState<{ tickets: number; openTickets: number; users: number } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([ticketApi.listAll(), adminApi.listUsers()])
        .then(([tickets, users]) => {
          if (cancelled) return;
          setStats({
            tickets: tickets.data.meta.itemCount,
            openTickets: tickets.data.data.filter((t) => t.status === 'open').length,
            users: users.data.meta.itemCount,
          });
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Admin Dashboard</Text>
        <Text style={styles.muted}>Welcome back, {user?.firstName}. Here's the platform at a glance.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="ticket-outline" size={16} color={colors.primaryDark} />
            </View>
            <Text style={styles.statValue}>{stats?.tickets ?? '—'}</Text>
            <Text style={styles.statLabel}>Total Tickets</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.warningSurface }]}>
              <Icon name="alert-circle-outline" size={16} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats?.openTickets ?? '—'}</Text>
            <Text style={styles.statLabel}>Open Tickets</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.infoSurface }]}>
              <Icon name="people-outline" size={16} color={colors.info} />
            </View>
            <Text style={styles.statValue}>{stats?.users ?? '—'}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
        </View>

        <Text style={styles.section}>Quick Actions</Text>
        <Card style={{ paddingHorizontal: spacing.md }}>
          <ListItem
            title="Review Dispute Tickets"
            subtitle="Respond to driver-raised issues"
            leftIcon="ticket-outline"
            onPress={() => navigation.navigate('Tickets')}
          />
          <Divider />
          <ListItem
            title="Manage Platform Users"
            subtitle="View drivers and admins on the network"
            leftIcon="people-outline"
            onPress={() => navigation.navigate('Users')}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  greeting: { ...typography.h1, color: colors.text },
  muted: { ...typography.body, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  statIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { ...typography.h2, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  section: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
});
