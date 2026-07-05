import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { taxiApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Button, Input, StatusPill, SectionHeader, ErrorState, SkeletonList, useToast } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import type { TaxiEnquiry } from '../../types';

type Route = RouteProp<DriverStackParamList, 'AvailabilityDetail'>;

export default function AvailabilityDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const toast = useToast();
  const [enquiries, setEnquiries] = useState<TaxiEnquiry[]>([]);
  const [message, setMessage] = useState('');
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(params.isOwner);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!params.isOwner) return;
    setError(null);
    try {
      const res = await taxiApi.listEnquiries(params.availabilityId);
      setEnquiries(res.data.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setInitialLoading(false);
    }
  }, [params.availabilityId, params.isOwner]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const sendEnquiry = async () => {
    if (!message.trim()) return;
    setSendingEnquiry(true);
    try {
      await taxiApi.createEnquiry(params.availabilityId, message.trim());
      toast.show('Your enquiry has been sent', 'success');
      setMessage('');
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setSendingEnquiry(false);
    }
  };

  // Fixed: previously this closed over stale `selectedEnquiry` state, so the
  // first tap on any enquiry silently did nothing. Now the id is passed directly.
  const respond = async (enquiryId: string) => {
    const text = responseDrafts[enquiryId]?.trim();
    if (!text) return;
    setRespondingId(enquiryId);
    try {
      await taxiApi.respondEnquiry(enquiryId, text);
      setResponseDrafts((prev) => ({ ...prev, [enquiryId]: '' }));
      toast.show('Response sent', 'success');
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setRespondingId(null);
    }
  };

  const deactivate = () => {
    Alert.alert('Deactivate Availability', 'Other drivers will no longer see this listing. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: async () => {
          try {
            await taxiApi.deactivate(params.availabilityId);
            toast.show('Availability deactivated', 'success');
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (params.isOwner && initialLoading) {
    return (
      <Screen>
        <SkeletonList count={2} />
      </Screen>
    );
  }

  if (params.isOwner && error) {
    return (
      <Screen>
        <ErrorState message={error} onRetry={load} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {!params.isOwner && (
          <Card>
            <SectionHeader title="Send Enquiry" />
            <Input value={message} onChangeText={setMessage} multiline placeholder="Ask about seats, timing, route…" />
            <Button title="Send Enquiry" icon="paper-plane-outline" onPress={sendEnquiry} loading={sendingEnquiry} />
          </Card>
        )}

        {params.isOwner && (
          <>
            <Button title="Deactivate Listing" variant="danger" icon="close-circle-outline" onPress={deactivate} />
            <SectionHeader title={`Enquiries${enquiries.length ? ` (${enquiries.length})` : ''}`} style={{ marginTop: spacing.lg }} />
            {enquiries.length === 0 ? (
              <Card>
                <Text style={styles.muted}>No enquiries yet. Interested drivers will appear here.</Text>
              </Card>
            ) : (
              enquiries.map((enq) => (
                <Card key={enq._id}>
                  <StatusPill status={enq.status} />
                  <Text style={styles.msg}>{enq.message}</Text>
                  {enq.enquirer && (
                    <Text style={styles.muted}>From: {enq.enquirer.firstName} {enq.enquirer.lastName}</Text>
                  )}
                  {enq.response && <Text style={styles.response}>Your response: {enq.response}</Text>}
                  {enq.status === 'pending' && (
                    <View style={{ marginTop: spacing.sm }}>
                      <Input
                        value={responseDrafts[enq._id] ?? ''}
                        onChangeText={(t) => setResponseDrafts((prev) => ({ ...prev, [enq._id]: t }))}
                        multiline
                        placeholder="Type your response…"
                      />
                      <Button title="Respond" onPress={() => respond(enq._id)} loading={respondingId === enq._id} />
                    </View>
                  )}
                </Card>
              ))
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  msg: { fontSize: 14, color: colors.text },
  muted: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  response: { fontSize: 13, color: colors.success, marginTop: 4, fontWeight: '600' },
});
