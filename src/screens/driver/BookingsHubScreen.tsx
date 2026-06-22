import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card } from '../../components/ui';
import { colors, spacing } from '../../theme';

const items = [
  { title: 'Post a Ride', desc: 'Publish Delhi → Chandigarh with fare & commission', screen: 'PostBooking' as const },
  { title: 'Browse Open Rides', desc: 'Find rides from other drivers', screen: 'OpenBookings' as const },
  { title: 'My Posted Rides', desc: 'Manage requests on your rides', screen: 'MyBookings' as const },
  { title: 'My Accepted Rides', desc: 'Pay commission & view customer details', screen: 'MyAcceptedBookings' as const },
];

export default function BookingsHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item) => (
          <TouchableOpacity key={item.screen} onPress={() => navigation.navigate(item.screen)}>
            <Card>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
