import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { bookingApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import {
  Screen,
  Card,
  Row,
  Button,
  Input,
  StatusPill,
  Icon,
  SectionHeader,
  ErrorState,
  SkeletonList,
  useToast,
} from '../../components/ui';
import { colors, spacing, typography, radius } from '../../theme';
import type { Booking, BookingRequest } from '../../types';

type Route = RouteProp<DriverStackParamList, 'BookingDetail'>;

export default function BookingDetailScreen() {
  const { params } = useRoute<Route>();
  const toast = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [bRes, rRes] = await Promise.all([
        bookingApi.getOne(params.bookingId),
        params.mode === 'my'
          ? bookingApi.listRequests(params.bookingId)
          : Promise.resolve({ data: { data: [] as BookingRequest[] } }),
      ]);
      setBooking(bRes.data.data);
      if (params.mode === 'my') setRequests(rRes.data.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setInitialLoading(false);
    }
  }, [params.bookingId, params.mode]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const sendRequest = async () => {
    setLoading(true);
    try {
      await bookingApi.createRequest(params.bookingId, message);
      toast.show('Request sent to the ride publisher', 'success');
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
      toast.show('Driver accepted — pay commission to unlock customer details', 'success');
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  const reject = (requestId: string) => {
    Alert.alert('Reject request', 'Are you sure you want to reject this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            await bookingApi.rejectRequest(params.bookingId, requestId);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  const payCommission = () => {
    if (!booking) return;
    Alert.alert(
      'Pay Commission',
      `Pay ₹${booking.commission.toLocaleString('en-IN')} commission to unlock this customer's contact details?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            setLoading(true);
            try {
              await bookingApi.payCommission(params.bookingId, `TXN-${Date.now()}`);
              toast.show('Commission paid — customer details unlocked', 'success');
              load();
            } catch (e) {
              Alert.alert('Error', getErrorMessage(e));
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  if (initialLoading) {
    return (
      <Screen>
        <SkeletonList count={3} />
      </Screen>
    );
  }

  if (error || !booking) {
    return (
      <Screen>
        <ErrorState message={error ?? 'Ride not found'} onRetry={load} />
      </Screen>
    );
  }

  const customerHidden = booking.customer.phoneNumber === 'Hidden';

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card variant="elevated">
            <View style={styles.headerRow}>
              <StatusPill status={booking.status} />
              <Text style={styles.fare}>₹{booking.actualPrice.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.routeRow}>
              <Text style={styles.routeText}>{booking.fromLocation}</Text>
              <Icon name="arrow-forward" size={16} color={colors.textTertiary} style={{ marginHorizontal: 8 }} />
              <Text style={styles.routeText}>{booking.toLocation}</Text>
            </View>
            <Row label="Commission" value={`₹${booking.commission.toLocaleString('en-IN')}`} />
            {booking.travelDate ? <Row label="Travel Date" value={new Date(booking.travelDate).toLocaleDateString()} /> : null}
            {booking.notes ? <Row label="Notes" value={booking.notes} /> : null}
          </Card>

          <Card>
            <SectionHeader title="Customer Details" />
            {customerHidden ? (
              <View style={styles.lockedBox}>
                <Icon name="lock-closed" size={20} color={colors.warning} />
                <Text style={styles.lockedText}>Pay commission after acceptance to unlock the customer's name, phone and notes.</Text>
              </View>
            ) : (
              <>
                <Row label="Name" value={booking.customer.name} />
                <Row label="Phone" value={booking.customer.phoneNumber} />
                {booking.customer.email ? <Row label="Email" value={booking.customer.email} /> : null}
                {booking.customer.notes ? <Row label="Notes" value={booking.customer.notes} /> : null}
              </>
            )}
          </Card>

          {params.mode === 'open' && booking.status === 'open' && (
            <Card>
              <SectionHeader title="Send a Request" />
              <Input
                value={message}
                onChangeText={setMessage}
                multiline
                placeholder="I can take this ride — available now."
              />
              <Button title="Send Request" icon="paper-plane-outline" onPress={sendRequest} loading={loading} />
            </Card>
          )}

          {params.mode === 'accepted' && booking.status === 'assigned' && customerHidden && (
            <Button title={`Pay Commission · ₹${booking.commission.toLocaleString('en-IN')}`} icon="card-outline" onPress={payCommission} loading={loading} />
          )}

          {params.mode === 'my' && (
            <View>
              <SectionHeader title={`Incoming Requests${requests.length ? ` (${requests.length})` : ''}`} />
              {requests.length === 0 ? (
                <Card>
                  <Text style={styles.muted}>No requests yet. Other drivers will appear here once they request this ride.</Text>
                </Card>
              ) : (
                requests.map((req) => (
                  <Card key={req._id}>
                    <StatusPill status={req.status} />
                    <Text style={styles.msg}>{req.message}</Text>
                    {req.requester && (
                      <Text style={styles.muted}>
                        {req.requester.firstName} {req.requester.lastName} · {req.requester.phoneNumber}
                      </Text>
                    )}
                    {req.status === 'pending' && booking.status === 'open' && (
                      <View style={styles.actionsRow}>
                        <Button title="Accept" onPress={() => accept(req._id)} style={{ flex: 1 }} />
                        <Button title="Reject" variant="danger" onPress={() => reject(req._id)} style={{ flex: 1 }} />
                      </View>
                    )}
                  </Card>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  fare: { ...typography.h2, color: colors.text },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  routeText: { ...typography.h3, color: colors.text },
  lockedBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.warningSurface,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  lockedText: { ...typography.bodySmall, color: '#8A5B00', flex: 1 },
  msg: { fontSize: 14, color: colors.text, marginVertical: 4 },
  muted: { fontSize: 13, color: colors.textSecondary },
  actionsRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
});
