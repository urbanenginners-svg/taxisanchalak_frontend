import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useAuth } from '../../context/AuthContext';
import { bookingApi, teamDriverApi, vehicleApi } from '../../api/services';
import { Screen, Card, Icon } from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<Record<string, undefined>, 'Home'>,
  NativeStackNavigationProp<DriverStackParamList>
>;

const shortcuts: { label: string; screen: keyof DriverStackParamList; icon: React.ComponentProps<typeof Icon>['name']; description: string }[] = [
  { label: 'Post a Ride', screen: 'PostBooking', icon: 'add-circle-outline', description: 'Publish a new ride' },
  { label: 'Browse Rides', screen: 'OpenBookings', icon: 'search-outline', description: 'Find open rides' },
  { label: 'My Posted Rides', screen: 'MyBookings', icon: 'list-outline', description: 'Manage requests' },
  { label: 'Accepted Rides', screen: 'MyAcceptedBookings', icon: 'checkmark-done-outline', description: 'Pay & unlock' },
  { label: 'Post Availability', screen: 'PostAvailability', icon: 'navigate-circle-outline', description: 'Show your taxi' },
  { label: 'Raise Ticket', screen: 'CreateTicket', icon: 'help-buoy-outline', description: 'Get support' },
];

interface Stats {
  posted: number;
  accepted: number;
  drivers: number;
  vehicles: number;
}

export default function DriverHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [stats, setStats] = useState<Stats | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([bookingApi.listMy(), bookingApi.listMyAccepted(), teamDriverApi.list(), vehicleApi.list()])
        .then(([posted, accepted, drivers, vehicles]) => {
          if (cancelled) return;
          setStats({
            posted: posted.data.meta.itemCount,
            accepted: accepted.data.meta.itemCount,
            drivers: drivers.data.meta.itemCount,
            vehicles: vehicles.data.meta.itemCount,
          });
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const goTo = (screen: keyof DriverStackParamList) => {
    const parent = navigation.getParent<NativeStackNavigationProp<DriverStackParamList>>();
    if (screen === 'CreateTicket') {
      parent?.navigate('CreateTicket', {});
    } else {
      parent?.navigate(screen as 'PostBooking');
    }
  };

  const statItems: { label: string; value: number | null; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { label: 'Posted', value: stats?.posted ?? null, icon: 'megaphone-outline' },
    { label: 'Accepted', value: stats?.accepted ?? null, icon: 'checkmark-circle-outline' },
    { label: 'Team', value: stats?.drivers ?? null, icon: 'people-outline' },
    { label: 'Vehicles', value: stats?.vehicles ?? null, icon: 'car-outline' },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{`Hello, ${user?.firstName ?? 'Driver'}`}</Text>
        <Text style={styles.muted}>Here's what's happening with your business today.</Text>

        <View style={styles.statsRow}>
          {statItems.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name={s.icon} size={16} color={colors.primaryDark} />
              </View>
              <Text style={styles.statValue}>{s.value ?? '—'}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.grid}>
          {shortcuts.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.tile}
              activeOpacity={0.7}
              onPress={() => goTo(item.screen)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.tileIconWrap}>
                <Icon name={item.icon} size={22} color={colors.primaryDark} />
              </View>
              <Text style={styles.tileLabel}>{item.label}</Text>
              <Text style={styles.tileDesc}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileLabel: { ...typography.bodyMedium, color: colors.text },
  tileDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
