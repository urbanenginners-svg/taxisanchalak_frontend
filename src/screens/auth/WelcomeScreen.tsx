import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing } from '../../theme';
import { Button } from '../../components/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🚕</Text>
        <Text style={styles.title}>Taxi Sanchalak</Text>
        <Text style={styles.tagline}>
          Connect with drivers, share rides, and grow your taxi business
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Driver Login" onPress={() => navigation.navigate('DriverLogin')} />
        <Button
          title="New Driver? Register"
          variant="outline"
          onPress={() => navigation.navigate('DriverRegister')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} style={styles.adminLink}>
          <Text style={styles.adminText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.header, justifyContent: 'space-between', padding: spacing.lg },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 72, marginBottom: spacing.md },
  title: { fontSize: 32, fontWeight: '800', color: colors.white, marginBottom: spacing.sm },
  tagline: { fontSize: 15, color: '#CBD5E1', textAlign: 'center', lineHeight: 22, paddingHorizontal: spacing.lg },
  actions: { paddingBottom: spacing.xl },
  adminLink: { marginTop: spacing.lg, alignItems: 'center' },
  adminText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
