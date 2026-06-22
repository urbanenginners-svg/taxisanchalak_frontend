import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ticketApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

type Route = RouteProp<DriverStackParamList, 'CreateTicket'>;

export default function CreateTicketScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await ticketApi.create({
        bookingId: params.bookingId,
        subject,
        description,
      });
      Alert.alert('Submitted', 'Admin will review your ticket');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Subject" value={subject} onChangeText={setSubject} placeholder="Fake ride / customer not paying" />
        <Input label="Description" value={description} onChangeText={setDescription} multiline />
        <Button title="Submit Ticket" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg } });
