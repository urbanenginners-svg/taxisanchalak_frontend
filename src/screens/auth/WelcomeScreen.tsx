import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, typography, radius } from '../../theme';
import { Button, Icon } from '../../components/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Icon name="car-sport" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Taxi Sanchalak</Text>
        <Text style={styles.tagline}>
          The operator network for professional taxi drivers — post rides, share your fleet, and grow together.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Driver Login" onPress={() => navigation.navigate('DriverLogin')} icon="log-in-outline" />
        <Button
          title="New Driver? Create an account"
          variant="outline"
          onPress={() => navigation.navigate('DriverRegister')}
          style={{ borderColor: 'rgba(255,255,255,0.35)' }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminLogin')}
          style={styles.adminLink}
          accessibilityRole="button"
        >
          <Text style={styles.adminText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.header, justifyContent: 'space-between', padding: spacing.xl },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(244,161,0,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.display, color: colors.white, marginBottom: spacing.sm, textAlign: 'center' },
  tagline: { ...typography.bodyLarge, color: '#B9BDCB', textAlign: 'center', paddingHorizontal: spacing.md },
  actions: { paddingBottom: spacing.lg, gap: spacing.xs },
  adminLink: { marginTop: spacing.md, alignItems: 'center', padding: spacing.xs },
  adminText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
