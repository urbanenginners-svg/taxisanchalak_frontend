import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/ui';
import { colors, spacing, radius, typography, shadow } from '../../theme';
import TeamDriversScreen from './TeamDriversScreen';
import VehiclesScreen from './VehiclesScreen';

export default function FleetHubScreen() {
  const [tab, setTab] = useState<'drivers' | 'vehicles'>('drivers');
  return (
    <Screen>
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentItem, tab === 'drivers' && styles.segmentItemActive]}
            onPress={() => setTab('drivers')}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === 'drivers' }}
          >
            <Text style={[styles.segmentText, tab === 'drivers' && styles.segmentTextActive]}>Team Drivers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, tab === 'vehicles' && styles.segmentItemActive]}
            onPress={() => setTab('vehicles')}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === 'vehicles' }}
          >
            <Text style={[styles.segmentText, tab === 'vehicles' && styles.segmentTextActive]}>Vehicles</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>{tab === 'drivers' ? <TeamDriversScreen /> : <VehiclesScreen />}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmentWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xs },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.neutralSurface,
    borderRadius: radius.md,
    padding: 4,
  },
  segmentItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: radius.sm },
  segmentItemActive: { backgroundColor: colors.surface, ...shadow.xs },
  segmentText: { ...typography.bodySmallMedium, color: colors.textSecondary },
  segmentTextActive: { color: colors.text },
});
