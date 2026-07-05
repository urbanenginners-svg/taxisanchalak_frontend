import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
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

export const authHeaderOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 17, color: colors.text },
  headerBackTitleVisible: false,
};

export default function RootNavigator() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={authHeaderOptions}>
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ title: 'Driver Login' }} />
        <AuthStack.Screen name="DriverRegister" component={DriverRegisterScreen} options={{ title: 'Create Account' }} />
        <AuthStack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
      </AuthStack.Navigator>
    );
  }

  if (role === 'admin') {
    return <AdminNavigator />;
  }

  return <DriverNavigator />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
