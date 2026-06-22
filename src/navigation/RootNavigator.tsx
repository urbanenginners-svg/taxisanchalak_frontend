import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import DriverLoginScreen from '../screens/auth/DriverLoginScreen';
import DriverRegisterScreen from '../screens/auth/DriverRegisterScreen';
import AdminLoginScreen from '../screens/auth/AdminLoginScreen';
import DriverNavigator from './DriverNavigator';
import AdminNavigator from './AdminNavigator';

export type AuthStackParamList = {
  Welcome: undefined;
  DriverLogin: undefined;
  DriverRegister: undefined;
  AdminLogin: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ title: 'Driver Login' }} />
        <AuthStack.Screen name="DriverRegister" component={DriverRegisterScreen} options={{ title: 'Driver Sign Up' }} />
        <AuthStack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
      </AuthStack.Navigator>
    );
  }

  if (role === 'admin') {
    return <AdminNavigator />;
  }

  return <DriverNavigator />;
}
