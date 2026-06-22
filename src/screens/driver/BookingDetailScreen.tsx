import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { bookingApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Row, Button, Badge, Input } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { Booking, BookingRequest } from '../../types';

type Route = RouteProp<DriverStackParamList, 'BookingDetail'>;

export default function BookingDetailScreen() {
  const { params } = useRoute<Route>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [bRes, rRes] = await Promise.all([
      bookingApi.getOne(params.bookingId),
      params.mode === 'my'
        ? bookingApi.listRequests(params.bookingId)
        : Promise.resolve({ data: { data: [] as BookingRequest[] } }),
    ]);
    setBooking(bRes.data.data);
    if (params.mode === 'my') setRequests(rRes.data.data);
  };

  useFocusEffect(useCallback(() => { load().catch((e) => Alert.alert('Error', getErrorMessage(e))); }, [params.bookingId]));

  const sendRequest = async () => {
    setLoading(true);
    try {
      await bookingApi.createRequest(params.bookingId, message);
      Alert.alert('Success', 'Request sent to ride publisher');
      setMessage('');
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const accept = async (requestId: string) => {
    try {
      await bookingApi.acceptRequest(params.bookingId, requestId);
      Alert.alert('Accepted', 'Driver accepted. They must pay commission to see customer details.');
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  const reject = async (requestId: string) => {
    try {
      await bookingApi.rejectRequest(params.bookingId, requestId);
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  const payCommission = async () => {
    setLoading(true);
    try {
      await bookingApi.payCommission(params.bookingId, `TXN-${Date.now()}`);
      Alert.alert('Success', 'Commission paid! Customer details are now visible.');
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <Screen><></></Screen>;

  const customerHidden = booking.customer.phoneNumber === 'Hidden';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Badge label={booking.status} />
          <Text style={styles.route}>{booking.fromLocation} → {booking.toLocation}</Text>
          <Row label="Fare" value={`₹${booking.actualPrice}`} />
          <Row label="Commission" value={`₹${booking.commission}`} />
        </Card>

        <Card>
          <Text style={styles.section}>Customer Details</Text>
          <Row label="Name" value={booking.customer.name} />
          <Row label="Phone" value={booking.customer.phoneNumber} />
          {booking.customer.email ? <Row label="Email" value={booking.customer.email} /> : null}
          {customerHidden && (
            <Text style={styles.hint}>Pay commission after acceptance to unlock customer details</Text>
          )}
        </Card>

        {params.mode === 'open' && booking.status === 'open' && (
          <Card>
            <Text style={styles.section}>Send Request</Text>
            <Input label="Message" value={message} onChangeText={setMessage} multiline placeholder="I can take this ride..." />
            <Button title="Send Request" onPress={sendRequest} loading={loading} />
          </Card>
        )}

        {params.mode === 'accepted' && booking.status === 'assigned' && customerHidden && (
          <Button title={`Pay Commission ₹${booking.commission}`} onPress={payCommission} loading={loading} />
        )}

        {params.mode === 'my' && (
          <View>
            <Text style={styles.section}>Incoming Requests</Text>
            {requests.map((req) => (
              <Card key={req._id}>
                <Badge label={req.status} color={req.status === 'accepted' ? colors.success : colors.warning} />
                <Text style={styles.msg}>{req.message}</Text>
                {req.requester && (
                  <Text style={styles.muted}>
                    {req.requester.firstName} {req.requester.lastName} · {req.requester.phoneNumber}
                  </Text>
                )}
                {req.status === 'pending' && booking.status === 'open' && (
                  <View style={styles.row}>
                    <Button title="Accept" onPress={() => accept(req._id)} style={{ flex: 1, marginRight: 8 }} />
                    <Button title="Reject" variant="danger" onPress={() => reject(req._id)} style={{ flex: 1 }} />
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 40 },
  route: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  hint: { fontSize: 12, color: colors.warning, marginTop: spacing.sm, fontStyle: 'italic' },
  msg: { fontSize: 14, color: colors.text, marginVertical: 4 },
  muted: { fontSize: 13, color: colors.textSecondary },
  row: { flexDirection: 'row', marginTop: spacing.sm },
});
