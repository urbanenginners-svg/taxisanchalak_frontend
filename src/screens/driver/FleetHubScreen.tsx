import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/ui';
import { colors, spacing } from '../../theme';
import TeamDriversScreen from './TeamDriversScreen';
import VehiclesScreen from './VehiclesScreen';

export default function FleetHubScreen() {
  const [tab, setTab] = useState<'drivers' | 'vehicles'>('drivers');
  return (
    <Screen>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'drivers' && styles.tabActive]} onPress={() => setTab('drivers')}>
          <Text style={[styles.tabText, tab === 'drivers' && styles.tabTextActive]}>Team Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'vehicles' && styles.tabActive]} onPress={() => setTab('vehicles')}>
          <Text style={[styles.tabText, tab === 'vehicles' && styles.tabTextActive]}>Vehicles</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>{tab === 'drivers' ? <TeamDriversScreen /> : <VehiclesScreen />}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontWeight: '600', color: colors.text },
  tabTextActive: { color: colors.white },
});
