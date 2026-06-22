import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../theme';

import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import FleetHubScreen from '../screens/driver/FleetHubScreen';
import BookingsHubScreen from '../screens/driver/BookingsHubScreen';
import TaxiHubScreen from '../screens/driver/TaxiHubScreen';
import ChatListScreen from '../screens/driver/ChatListScreen';
import ProfileScreen from '../screens/driver/ProfileScreen';

import OpenBookingsScreen from '../screens/driver/OpenBookingsScreen';
import MyBookingsScreen from '../screens/driver/MyBookingsScreen';
import MyAcceptedBookingsScreen from '../screens/driver/MyAcceptedBookingsScreen';
import PostBookingScreen from '../screens/driver/PostBookingScreen';
import BookingDetailScreen from '../screens/driver/BookingDetailScreen';
import AddTeamDriverScreen from '../screens/driver/AddTeamDriverScreen';
import AddVehicleScreen from '../screens/driver/AddVehicleScreen';
import PostAvailabilityScreen from '../screens/driver/PostAvailabilityScreen';
import AvailabilityDetailScreen from '../screens/driver/AvailabilityDetailScreen';
import ChatScreen from '../screens/driver/ChatScreen';
import TicketsScreen from '../screens/driver/TicketsScreen';
import CreateTicketScreen from '../screens/driver/CreateTicketScreen';

export type DriverStackParamList = {
  DriverTabs: undefined;
  AddTeamDriver: undefined;
  AddVehicle: undefined;
  PostBooking: undefined;
  OpenBookings: undefined;
  MyBookings: undefined;
  MyAcceptedBookings: undefined;
  BookingDetail: { bookingId: string; mode: 'open' | 'my' | 'accepted' };
  PostAvailability: undefined;
  AvailabilityDetail: { availabilityId: string; isOwner: boolean };
  Chat: { conversationId: string; title: string };
  Tickets: undefined;
  CreateTicket: { bookingId?: string };
};

const Stack = createNativeStackNavigator<DriverStackParamList>();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Fleet: '🚗',
    Rides: '📋',
    Taxi: '🚕',
    Chat: '💬',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 20 : 18, opacity: focused ? 1 : 0.6 }}>
      {icons[label] ?? '•'}
    </Text>
  );
}

function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={DriverHomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Fleet" component={FleetHubScreen} options={{ title: 'My Fleet' }} />
      <Tab.Screen name="Rides" component={BookingsHubScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Taxi" component={TaxiHubScreen} options={{ title: 'Availability' }} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="DriverTabs"
        component={DriverTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddTeamDriver" component={AddTeamDriverScreen} options={{ title: 'Add Team Driver' }} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Add Vehicle' }} />
      <Stack.Screen name="PostBooking" component={PostBookingScreen} options={{ title: 'Post Booking' }} />
      <Stack.Screen name="OpenBookings" component={OpenBookingsScreen} options={{ title: 'Browse Rides' }} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Posted Rides' }} />
      <Stack.Screen
        name="MyAcceptedBookings"
        component={MyAcceptedBookingsScreen}
        options={{ title: 'My Accepted Rides' }}
      />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Booking Details' }} />
      <Stack.Screen name="PostAvailability" component={PostAvailabilityScreen} options={{ title: 'Post Availability' }} />
      <Stack.Screen name="AvailabilityDetail" component={AvailabilityDetailScreen} options={{ title: 'Availability' }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Tickets" component={TicketsScreen} options={{ title: 'Support Tickets' }} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ title: 'Raise Ticket' }} />
    </Stack.Navigator>
  );
}
