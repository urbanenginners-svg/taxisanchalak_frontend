import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing } from '../theme';

export function Screen({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Title({ children, style }: { children: string; style?: TextStyle }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children }: { children: string }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInputLike
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

function TextInputLike({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
}) {
  const TextInput = require('react-native').TextInput;
  return (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

export function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  style,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        variant === 'outline' && styles.buttonOutline,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'outline' && styles.buttonTextOutline,
            variant === 'secondary' && styles.buttonTextDark,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color ?? colors.primary }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrap: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputMultiline: { minHeight: 90, paddingTop: 12 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonSecondary: { backgroundColor: colors.header },
  buttonDanger: { backgroundColor: colors.error },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  buttonTextOutline: { color: colors.primary },
  buttonTextDark: { color: colors.white },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.textSecondary, fontSize: 14 },
  rowValue: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' },
});
