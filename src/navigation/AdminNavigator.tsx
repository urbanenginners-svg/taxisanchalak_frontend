import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../theme';

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

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminHomeScreen}
        options={{ tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="Tickets"
        component={AdminTicketsScreen}
        options={{ tabBarIcon: () => <Text>🎫</Text> }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{ tabBarIcon: () => <Text>👥</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <Text>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TicketDetail"
        component={AdminTicketDetailScreen}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
}
