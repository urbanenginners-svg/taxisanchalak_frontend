import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { Screen, Card, ListItem, Button, Icon, Divider } from '../../components/ui';
import { spacing } from '../../theme';

const items: { title: string; desc: string; screen: keyof DriverStackParamList; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
  { title: 'Browse Open Rides', desc: 'Find rides posted by other drivers', screen: 'OpenBookings', icon: 'search-outline' },
  { title: 'My Posted Rides', desc: 'Manage requests on rides you posted', screen: 'MyBookings', icon: 'megaphone-outline' },
  { title: 'My Accepted Rides', desc: 'Pay commission & view customer details', screen: 'MyAcceptedBookings', icon: 'checkmark-done-outline' },
];

export default function BookingsHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DriverStackParamList>>();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Button title="Post a New Ride" icon="add-circle-outline" onPress={() => navigation.navigate('PostBooking')} style={{ marginBottom: spacing.lg, marginTop: 0 }} />
        <Card style={{ paddingHorizontal: spacing.md }}>
          {items.map((item, idx) => (
            <View key={item.screen}>
              <ListItem
                title={item.title}
                subtitle={item.desc}
                leftIcon={item.icon}
                onPress={() => navigation.navigate(item.screen as 'OpenBookings')}
              />
              {idx < items.length - 1 && <Divider />}
            </View>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
});
