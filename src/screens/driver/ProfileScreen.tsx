import React from 'react';
import { ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Screen, Card, Row, Button } from '../../components/ui';
import { colors, spacing } from '../../theme';

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.role}>{role === 'admin' ? 'Administrator' : 'Driver'}</Text>
          <Row label="Email" value={user?.email ?? '-'} />
          <Row label="Phone" value={user?.phoneNumber ?? '-'} />
          {user?.city ? <Row label="City" value={`${user.city}, ${user.state}`} /> : null}
        </Card>
        {role === 'driver' && (
          <Button title="Support Tickets" variant="outline" onPress={() => navigation.navigate('Tickets' as never)} />
        )}
        <Button title="Logout" variant="danger" onPress={handleLogout} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  role: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: spacing.md },
});
