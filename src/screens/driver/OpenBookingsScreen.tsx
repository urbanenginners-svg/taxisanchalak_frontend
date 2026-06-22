import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { bookingApi } from '../../api/services';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Badge, EmptyState } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Booking } from '../../types';

function BookingCard({ item, onPress }: { item: Booking; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Badge label={item.status} />
        <Text style={styles.route}>{item.fromLocation} → {item.toLocation}</Text>
        <Text style={styles.price}>₹{item.actualPrice} · Commission ₹{item.commission}</Text>
        <Text style={styles.muted}>Customer: {item.customer.name} · {item.customer.phoneNumber}</Text>
      </Card>
    </TouchableOpacity>
  );
}

export default function OpenBookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(useCallback(() => {
    bookingApi.listOpen().then((res) => setBookings(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No open rides available" />}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id, mode: 'open' })}
          />
        )}
      />
    </Screen>
  );
}

export function MyBookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(useCallback(() => {
    bookingApi.listMy().then((res) => setBookings(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="You haven't posted any rides" />}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id, mode: 'my' })}
          />
        )}
      />
    </Screen>
  );
}

export function MyAcceptedBookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(useCallback(() => {
    bookingApi.listMyAccepted().then((res) => setBookings(res.data.data));
  }, []));

  return (
    <Screen>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No accepted rides yet" />}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id, mode: 'accepted' })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  route: { fontSize: 17, fontWeight: '700', color: colors.text },
  price: { fontSize: 15, color: colors.primary, fontWeight: '600', marginTop: 4 },
  muted: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
