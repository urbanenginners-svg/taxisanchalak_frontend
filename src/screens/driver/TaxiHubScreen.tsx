import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card } from '../../components/ui';
import { colors, spacing } from '../../theme';

export default function TaxiHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('PostAvailability')}>
          <Card>
            <Text style={styles.title}>🚕 Post Taxi Availability</Text>
            <Text style={styles.desc}>Let other drivers know your taxi is available</Text>
          </Card>
        </TouchableOpacity>
        <ActiveAvailabilitiesList navigation={navigation} />
      </ScrollView>
    </Screen>
  );
}

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { taxiApi } from '../../api/services';
import type { TaxiAvailability } from '../../types';
import { Badge, EmptyState } from '../../components/ui';

function ActiveAvailabilitiesList({
  navigation,
}: {
  navigation: NativeStackNavigationProp<DriverStackParamList>;
}) {
  const [active, setActive] = useState<TaxiAvailability[]>([]);
  const [mine, setMine] = useState<TaxiAvailability[]>([]);

  useFocusEffect(useCallback(() => {
    taxiApi.listActive().then((r) => setActive(r.data.data));
    taxiApi.listMy().then((r) => setMine(r.data.data));
  }, []));

  return (
    <>
      <Text style={styles.section}>My Availabilities</Text>
      {mine.length === 0 ? <EmptyState message="No availabilities posted" /> : null}
      {mine.map((item) => (
        <TouchableOpacity
          key={item._id}
          onPress={() => navigation.navigate('AvailabilityDetail', { availabilityId: item._id, isOwner: true })}
        >
          <Card>
            <Badge label={item.status} />
            <Text style={styles.title}>{item.fromLocation}{item.toLocation ? ` → ${item.toLocation}` : ''}</Text>
          </Card>
        </TouchableOpacity>
      ))}
      <Text style={styles.section}>Browse Active Taxis</Text>
      {active.length === 0 ? <EmptyState message="No active taxis" /> : null}
      {active.map((item) => (
        <TouchableOpacity
          key={item._id}
          onPress={() => navigation.navigate('AvailabilityDetail', { availabilityId: item._id, isOwner: false })}
        >
          <Card>
            <Text style={styles.title}>{item.fromLocation}{item.toLocation ? ` → ${item.toLocation}` : ''}</Text>
            {item.driver && (
              <Text style={styles.desc}>
                {item.driver.firstName} {item.driver.lastName}
              </Text>
            )}
          </Card>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginVertical: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
