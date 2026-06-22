import React, { useCallback, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { taxiApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, Button, Input, Badge } from '../../components/ui';
import { colors, spacing } from '../../theme';
import type { TaxiEnquiry } from '../../types';

type Route = RouteProp<DriverStackParamList, 'AvailabilityDetail'>;

export default function AvailabilityDetailScreen() {
  const { params } = useRoute<Route>();
  const [enquiries, setEnquiries] = useState<TaxiEnquiry[]>([]);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<string>();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (params.isOwner) {
      const res = await taxiApi.listEnquiries(params.availabilityId);
      setEnquiries(res.data.data);
    }
  };

  useFocusEffect(useCallback(() => { load().catch(() => {}); }, [params.availabilityId]));

  const sendEnquiry = async () => {
    setLoading(true);
    try {
      await taxiApi.createEnquiry(params.availabilityId, message);
      Alert.alert('Sent', 'Your enquiry has been sent');
      setMessage('');
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const respond = async () => {
    if (!selectedEnquiry) return;
    setLoading(true);
    try {
      await taxiApi.respondEnquiry(selectedEnquiry, response);
      setResponse('');
      setSelectedEnquiry(undefined);
      load();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async () => {
    try {
      await taxiApi.deactivate(params.availabilityId);
      Alert.alert('Done', 'Availability deactivated');
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {!params.isOwner && (
          <Card>
            <Text style={styles.section}>Send Enquiry</Text>
            <Input label="Message" value={message} onChangeText={setMessage} multiline />
            <Button title="Send Enquiry" onPress={sendEnquiry} loading={loading} />
          </Card>
        )}

        {params.isOwner && (
          <>
            <Button title="Deactivate" variant="danger" onPress={deactivate} />
            <Text style={styles.section}>Enquiries</Text>
            {enquiries.map((enq) => (
              <Card key={enq._id}>
                <Badge label={enq.status} />
                <Text style={styles.msg}>{enq.message}</Text>
                {enq.enquirer && (
                  <Text style={styles.muted}>
                    From: {enq.enquirer.firstName} {enq.enquirer.lastName}
                  </Text>
                )}
                {enq.response && <Text style={styles.response}>Response: {enq.response}</Text>}
                {enq.status === 'pending' && (
                  <>
                    <Input label="Your Response" value={selectedEnquiry === enq._id ? response : ''} onChangeText={(t) => { setSelectedEnquiry(enq._id); setResponse(t); }} multiline />
                    <Button title="Respond" onPress={() => { setSelectedEnquiry(enq._id); respond(); }} loading={loading} />
                  </>
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginVertical: spacing.md },
  msg: { fontSize: 14, color: colors.text },
  muted: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  response: { fontSize: 13, color: colors.success, marginTop: 4 },
});
