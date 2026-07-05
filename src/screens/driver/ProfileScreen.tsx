import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Screen, Card, Row, Button, Avatar, ListItem, Divider, StatusPill } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const navigation = useNavigation();
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Driver';

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card variant="elevated" style={styles.profileCard}>
          <Avatar name={fullName} size={64} />
          <Text style={styles.name}>{fullName}</Text>
          <StatusPill tone={role === 'admin' ? 'primary' : 'success'} label={role === 'admin' ? 'Administrator' : 'Driver Partner'} />
        </Card>

        <Card>
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Phone" value={user?.phoneNumber ?? '—'} />
          {user?.city ? <Row label="Location" value={`${user.city}${user.state ? `, ${user.state}` : ''}`} /> : null}
        </Card>

        <Card style={{ padding: 0, paddingHorizontal: spacing.md }}>
          {role === 'driver' && (
            <>
              <ListItem
                title="Support Tickets"
                subtitle="View or raise a dispute"
                leftIcon="help-buoy-outline"
                onPress={() => navigation.navigate('Tickets' as never)}
              />
              <Divider />
            </>
          )}
          <ListItem
            title="Log Out"
            leftIcon="log-out-outline"
            onPress={handleLogout}
            destructive
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  profileCard: { alignItems: 'center', paddingVertical: spacing.xl },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.xs },
});
