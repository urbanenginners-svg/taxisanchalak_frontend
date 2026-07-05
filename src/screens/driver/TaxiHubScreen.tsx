import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { taxiApi } from '../../api/services';
import type { TaxiAvailability } from '../../types';
import { Screen, Card, EmptyState, SectionHeader, StatusPill, Icon, SkeletonList, Button } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export default function TaxiHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [active, setActive] = useState<TaxiAvailability[]>([]);
  const [mine, setMine] = useState<TaxiAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const [activeRes, mineRes] = await Promise.all([taxiApi.listActive(), taxiApi.listMy()]);
      setActive(activeRes.data.data);
      setMine(mineRes.data.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => {
    setRefreshing(true);
    load({ silent: true });
  };

  return (
    <Screen>
      {loading ? (
        <SkeletonList />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          <Button
            title="Post Taxi Availability"
            icon="navigate-circle-outline"
            onPress={() => navigation.navigate('PostAvailability')}
            style={{ marginTop: 0, marginBottom: spacing.lg }}
          />

          <SectionHeader title="My Availabilities" />
          {mine.length === 0 ? (
            <EmptyState icon="navigate-circle-outline" message="You haven't posted your taxi availability yet." />
          ) : (
            mine.map((item) => (
              <Card key={item._id} onPress={() => navigation.navigate('AvailabilityDetail', { availabilityId: item._id, isOwner: true })}>
                <StatusPill status={item.status} />
                <View style={styles.routeRow}>
                  <Text style={styles.title}>{item.fromLocation}</Text>
                  {item.toLocation ? (
                    <>
                      <Icon name="arrow-forward" size={14} color={colors.textTertiary} style={{ marginHorizontal: 6 }} />
                      <Text style={styles.title}>{item.toLocation}</Text>
                    </>
                  ) : null}
                </View>
              </Card>
            ))
          )}

          <SectionHeader title="Browse Active Taxis" style={{ marginTop: spacing.md }} />
          {active.length === 0 ? (
            <EmptyState icon="car-outline" message="No other drivers have posted availability right now." />
          ) : (
            active.map((item) => (
              <Card key={item._id} onPress={() => navigation.navigate('AvailabilityDetail', { availabilityId: item._id, isOwner: false })}>
                <View style={styles.routeRow}>
                  <Text style={styles.title}>{item.fromLocation}</Text>
                  {item.toLocation ? (
                    <>
                      <Icon name="arrow-forward" size={14} color={colors.textTertiary} style={{ marginHorizontal: 6 }} />
                      <Text style={styles.title}>{item.toLocation}</Text>
                    </>
                  ) : null}
                </View>
                {item.driver && (
                  <Text style={styles.desc}>{item.driver.firstName} {item.driver.lastName}</Text>
                )}
              </Card>
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.bodyMedium, color: colors.text },
  desc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
});
