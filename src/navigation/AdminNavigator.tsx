import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';
import { stackHeaderOptions } from './DriverNavigator';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminTicketsScreen from '../screens/admin/AdminTicketsScreen';
import AdminTicketDetailScreen from '../screens/admin/AdminTicketDetailScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import ProfileScreen from '../screens/driver/ProfileScreen';

export type AdminStackParamList = {
  AdminTabs: undefined;
  TicketDetail: { ticketId: string };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Tickets: { active: 'ticket', inactive: 'ticket-outline' },
  Users: { active: 'people', inactive: 'people-outline' },
  Profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

function AdminTabs() {
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
        tabBarIcon: ({ focused, color }) => {
          const icon = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
          return <Ionicons name={focused ? icon.active : icon.inactive} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminHomeScreen} />
      <Tab.Screen name="Tickets" component={AdminTicketsScreen} />
      <Tab.Screen name="Users" component={AdminUsersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={stackHeaderOptions}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TicketDetail"
        component={AdminTicketDetailScreen}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
}
