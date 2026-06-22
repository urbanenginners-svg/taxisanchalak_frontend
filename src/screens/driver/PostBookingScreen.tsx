import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bookingApi } from '../../api/services';
import { getErrorMessage } from '../../api/client';
import { Screen, Input, Button } from '../../components/ui';
import { spacing } from '../../theme';

export default function PostBookingScreen() {
  const navigation = useNavigation();
  const [fromLocation, setFrom] = useState('Delhi');
  const [toLocation, setTo] = useState('Chandigarh');
  const [actualPrice, setPrice] = useState('10000');
  const [commission, setCommission] = useState('1000');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await bookingApi.create({
        fromLocation,
        toLocation,
        actualPrice: Number(actualPrice),
        commission: Number(commission),
        customer: {
          name: customerName,
          phoneNumber: customerPhone,
          email: customerEmail || undefined,
          notes: notes || undefined,
        },
      });
      Alert.alert('Success', 'Ride posted successfully');
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
        <Input label="From" value={fromLocation} onChangeText={setFrom} />
        <Input label="To" value={toLocation} onChangeText={setTo} />
        <Input label="Actual Price (₹)" value={actualPrice} onChangeText={setPrice} keyboardType="numeric" />
        <Input label="Commission (₹)" value={commission} onChangeText={setCommission} keyboardType="numeric" />
        <Input label="Customer Name" value={customerName} onChangeText={setCustomerName} />
        <Input label="Customer Phone" value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" />
        <Input label="Customer Email" value={customerEmail} onChangeText={setCustomerEmail} keyboardType="email-address" />
        <Input label="Notes" value={notes} onChangeText={setNotes} multiline />
        <Button title="Publish Ride" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, paddingBottom: 40 } });
