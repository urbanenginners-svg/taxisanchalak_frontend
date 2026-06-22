import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { useAuth } from '../../context/AuthContext';
import { Screen, Card, Title } from '../../components/ui';
import { colors, spacing } from '../../theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<Record<string, undefined>, 'Home'>,
  NativeStackNavigationProp<DriverStackParamList>
>;

const shortcuts: { label: string; screen: keyof DriverStackParamList; icon: string }[] = [
  { label: 'Post a Ride', screen: 'PostBooking', icon: '📢' },
  { label: 'Browse Rides', screen: 'OpenBookings', icon: '🔍' },
  { label: 'My Posted Rides', screen: 'MyBookings', icon: '📋' },
  { label: 'Accepted Rides', screen: 'MyAcceptedBookings', icon: '✅' },
  { label: 'Post Availability', screen: 'PostAvailability', icon: '🚕' },
  { label: 'Raise Ticket', screen: 'CreateTicket', icon: '🎫' },
];

export default function DriverHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Title style={{ fontSize: 20, marginBottom: 4 }}>
            {`Hello, ${user?.firstName ?? 'Driver'} 👋`}
          </Title>
          <Text style={styles.muted}>Manage rides, fleet, and connect with drivers</Text>
        </Card>
        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.grid}>
          {shortcuts.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.tile}
              onPress={() => {
                const parent = navigation.getParent<NativeStackNavigationProp<DriverStackParamList>>();
                if (item.screen === 'CreateTicket') {
                  parent?.navigate('CreateTicket', {});
                } else {
                  parent?.navigate(item.screen as 'PostBooking');
                }
              }}
            >
              <Text style={styles.tileIcon}>{item.icon}</Text>
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  muted: { color: colors.textSecondary, fontSize: 14 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tileIcon: { fontSize: 28, marginBottom: spacing.sm },
  tileLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },
});
