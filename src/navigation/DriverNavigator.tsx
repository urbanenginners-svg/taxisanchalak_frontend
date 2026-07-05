import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

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

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'grid', inactive: 'grid-outline' },
  Fleet: { active: 'car-sport', inactive: 'car-sport-outline' },
  Rides: { active: 'briefcase', inactive: 'briefcase-outline' },
  Taxi: { active: 'navigate-circle', inactive: 'navigate-circle-outline' },
  Chat: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  Profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  const icon = TAB_ICONS[label] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
  return <Ionicons name={focused ? icon.active : icon.inactive} size={22} color={color} />;
}

export const stackHeaderOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 17, color: colors.text },
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...stackHeaderOptions,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.select({ ios: 88, default: 64 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 28, default: 8 }),
          ...shadow.sm,
        },
        tabBarIcon: ({ focused, color }) => <TabIcon label={route.name} focused={focused} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={DriverHomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Fleet" component={FleetHubScreen} options={{ title: 'My Fleet' }} />
      <Tab.Screen name="Rides" component={BookingsHubScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Taxi" component={TaxiHubScreen} options={{ title: 'Availability' }} />
      <Tab.Screen name="Chat" component={ChatListScreen} options={{ title: 'Messages' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddTeamDriver" component={AddTeamDriverScreen} options={{ title: 'Add Team Driver' }} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Add Vehicle' }} />
      <Stack.Screen name="PostBooking" component={PostBookingScreen} options={{ title: 'Post a Ride' }} />
      <Stack.Screen name="OpenBookings" component={OpenBookingsScreen} options={{ title: 'Browse Rides' }} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Posted Rides' }} />
      <Stack.Screen
        name="MyAcceptedBookings"
        component={MyAcceptedBookingsScreen}
        options={{ title: 'My Accepted Rides' }}
      />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Ride Details' }} />
      <Stack.Screen name="PostAvailability" component={PostAvailabilityScreen} options={{ title: 'Post Availability' }} />
      <Stack.Screen name="AvailabilityDetail" component={AvailabilityDetailScreen} options={{ title: 'Availability' }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Tickets" component={TicketsScreen} options={{ title: 'Support Tickets' }} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ title: 'Raise a Ticket' }} />
    </Stack.Navigator>
  );
}
