import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Screen, Card, Title } from '../../components/ui';
import { colors, spacing } from '../../theme';

export default function AdminHomeScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Title style={{ fontSize: 20 }}>Admin Dashboard</Title>
          <Text style={styles.muted}>Welcome, {user?.firstName}. Manage tickets and users.</Text>
        </Card>
        <Card>
          <Text style={styles.item}>🎫 Review dispute tickets from drivers</Text>
          <Text style={styles.item}>👥 Manage platform users</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  muted: { color: colors.textSecondary, fontSize: 14 },
  item: { fontSize: 15, color: colors.text, marginBottom: spacing.sm },
});
