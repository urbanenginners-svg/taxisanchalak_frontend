import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Modal,
  FlatList,
  ScrollView,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow, typography, duration, tones, toneForStatus, statusLabel, hitSlop, Tone } from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/* ------------------------------------------------------------------ */
/* Icon                                                                 */
/* ------------------------------------------------------------------ */

export function Icon({
  name,
  size = 20,
  color = colors.text,
  style,
}: {
  name: IoniconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

/* ------------------------------------------------------------------ */
/* Press animation helper                                              */
/* ------------------------------------------------------------------ */

function usePressScale(to = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.timing(scale, { toValue: to, duration: duration.fast, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: duration.fast, useNativeDriver: true }).start();
  return { style: { transform: [{ scale }] }, onPressIn, onPressOut };
}

/* ------------------------------------------------------------------ */
/* Screen / layout primitives                                          */
/* ------------------------------------------------------------------ */

export function Screen({
  children,
  style,
  scroll,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
}) {
  if (scroll) {
    return (
      <View style={[styles.screen, style]}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </View>
    );
  }
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} hitSlop={hitSlop} accessibilityRole="button">
          <Text style={styles.sectionHeaderAction}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  onPress,
  variant = 'flat',
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'flat' | 'elevated';
  accessibilityLabel?: string;
}) {
  const press = usePressScale(0.985);
  const base = [styles.card, variant === 'elevated' && styles.cardElevated, style];

  if (!onPress) {
    return <View style={base}>{children}</View>;
  }

  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={base}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                               */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = true,
  style,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: IoniconName;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const press = usePressScale(0.97);
  const isDisabled = Boolean(disabled || loading);

  const textColor =
    variant === 'outline' ? colors.primaryDark : variant === 'ghost' ? colors.text : colors.textInverse;

  return (
    <Animated.View style={[press.style, !fullWidth && { alignSelf: 'flex-start' }]}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.button,
          size === 'sm' && styles.buttonSm,
          variant === 'secondary' && styles.buttonSecondary,
          variant === 'danger' && styles.buttonDanger,
          variant === 'outline' && styles.buttonOutline,
          variant === 'ghost' && styles.buttonGhost,
          isDisabled && styles.buttonDisabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <Icon name={icon} size={17} color={isDisabled ? colors.disabledText : textColor} style={{ marginRight: 8 }} />}
            <Text
              style={[
                styles.buttonText,
                size === 'sm' && styles.buttonTextSm,
                { color: textColor },
                isDisabled && styles.buttonTextDisabled,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function IconButton({
  name,
  onPress,
  color = colors.text,
  size = 20,
  background,
  accessibilityLabel,
}: {
  name: IoniconName;
  onPress: () => void;
  color?: string;
  size?: number;
  background?: string;
  accessibilityLabel?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={hitSlop}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.iconButton, background ? { backgroundColor: background } : null]}
    >
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

export function FAB({ icon = 'add', onPress, label }: { icon?: IoniconName; onPress: () => void; label?: string }) {
  const press = usePressScale(0.94);
  return (
    <Animated.View style={[styles.fabWrap, press.style]}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel={label ?? 'Action'}
      >
        <Icon name={icon} size={24} color={colors.white} />
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/* Field error message                                                  */
/* ------------------------------------------------------------------ */

function FieldErrorMessage({ message }: { message: string }) {
  return (
    <View style={styles.errorRow}>
      <Icon name="alert-circle" size={14} color={colors.error} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                               */
/* ------------------------------------------------------------------ */

export function Input({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  required,
  error,
  helperText,
  prefix,
  leftIcon,
  editable = true,
  maxLength,
  autoCapitalize,
}: {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  prefix?: string;
  leftIcon?: IoniconName;
  editable?: boolean;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const [focused, setFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.inputWrap}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputBox,
          multiline && styles.inputBoxMultiline,
          focused && !hasError && styles.inputBoxFocused,
          hasError && styles.inputBoxError,
          !editable && styles.inputBoxDisabled,
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={18}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}
        {prefix ? <Text style={styles.inputPrefix}>{prefix}</Text> : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !secureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          accessibilityLabel={label ?? placeholder}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setSecureVisible((v) => !v)} hitSlop={hitSlop}>
            <Icon name={secureVisible ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {hasError ? (
        <FieldErrorMessage message={error!} />
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

export function SelectField({
  label,
  value,
  placeholder = 'Select…',
  required,
  options,
  onSelect,
  onBlur,
  helperText,
  error,
  emptyMessage = 'No options available',
  searchable = false,
  searchPlaceholder = 'Search…',
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  options: { id: string; title: string; subtitle?: string }[];
  onSelect: (id: string) => void;
  onBlur?: () => void;
  helperText?: string;
  error?: string;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((o) => o.id === value);
  const hasError = Boolean(error);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => o.title.toLowerCase().includes(q) || (o.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query, searchable]);

  const close = () => {
    setOpen(false);
    setQuery('');
    onBlur?.();
  };

  return (
    <View style={styles.inputWrap}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.inputBox, styles.selectBox, hasError && styles.inputBoxError]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label ?? 'Select'}
      >
        <Text
          style={selected ? styles.selectValue : styles.selectPlaceholder}
          numberOfLines={1}
        >
          {selected ? (selected.subtitle ? `${selected.title}, ${selected.subtitle}` : selected.title) : placeholder}
        </Text>
        <Icon name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      {hasError ? (
        <FieldErrorMessage message={error!} />
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <Pressable style={styles.sheetOverlay} onPress={close}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label ?? 'Select an option'}</Text>
            {searchable && (
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                onClear={() => setQuery('')}
              />
            )}
            {options.length === 0 ? (
              <EmptyState icon="albums-outline" title="Nothing here yet" message={emptyMessage} />
            ) : filtered.length === 0 ? (
              <EmptyState icon="search-outline" title="No matches" message="Try a different city or state name." />
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(o) => o.id}
                style={styles.sheetList}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={20}
                maxToRenderPerBatch={30}
                windowSize={8}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.sheetOption}
                    onPress={() => {
                      onSelect(item.id);
                      close();
                    }}
                    accessibilityRole="button"
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sheetOptionTitle}>{item.title}</Text>
                      {item.subtitle ? <Text style={styles.sheetOptionSubtitle}>{item.subtitle}</Text> : null}
                    </View>
                    {item.id === value && <Icon name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <Divider />}
              />
            )}
            <Button title="Close" variant="ghost" onPress={close} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Lightweight calendar picker — no native dependency required. Value/onChange use YYYY-MM-DD. */
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  required,
  helperText,
  error,
  maximumDate,
}: {
  label?: string;
  value: string;
  onChange: (isoDate: string) => void;
  onBlur?: () => void;
  required?: boolean;
  helperText?: string;
  error?: string;
  maximumDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value) : new Date(1995, 0, 1);
  const [cursor, setCursor] = useState({ year: parsed.getFullYear(), month: parsed.getMonth() });
  const hasError = Boolean(error);

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const cells = [...Array(firstWeekday).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];

  const isFuture = (y: number, m: number) => {
    if (!maximumDate) return false;
    const test = new Date(y, m + 1, 0);
    return test > maximumDate;
  };

  const displayValue = value
    ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const close = () => {
    setOpen(false);
    onBlur?.();
  };

  return (
    <View style={styles.inputWrap}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.inputBox, styles.selectBox, hasError && styles.inputBoxError]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Icon name="calendar-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <Text style={[displayValue ? styles.selectValue : styles.selectPlaceholder, { flex: 1 }]}>
          {displayValue || 'Select date'}
        </Text>
      </TouchableOpacity>
      {hasError ? (
        <FieldErrorMessage message={error!} />
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      <Modal visible={open} animationType="fade" transparent onRequestClose={close}>
        <Pressable style={styles.sheetOverlay} onPress={close}>
          <Pressable style={styles.calendarCard} onPress={() => {}}>
            <View style={styles.calendarHeader}>
              <IconButton name="chevron-back" onPress={() => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }))} />
              <Text style={styles.calendarHeaderText}>{MONTH_NAMES[cursor.month]} {cursor.year}</Text>
              <IconButton
                name="chevron-forward"
                onPress={() => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }))}
                color={isFuture(cursor.year, cursor.month + 1) ? colors.disabledText : colors.text}
              />
            </View>
            <View style={styles.calendarWeekRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={`${d}-${i}`} style={styles.calendarWeekday}>{d}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {cells.map((day, idx) => {
                if (!day) return <View key={idx} style={styles.calendarCell} />;
                const disabled = maximumDate ? new Date(cursor.year, cursor.month, day) > maximumDate : false;
                const iso = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = value === iso;
                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={disabled}
                    style={[styles.calendarCell, isSelected && styles.calendarCellSelected]}
                    onPress={() => {
                      onChange(iso);
                      close();
                    }}
                  >
                    <Text style={[styles.calendarDayText, disabled && { color: colors.disabledText }, isSelected && styles.calendarDayTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Button title="Close" variant="ghost" onPress={close} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onClear?: () => void;
}) {
  return (
    <View style={styles.searchBar}>
      <Icon name="search" size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => (onClear ? onClear() : onChangeText(''))} hitSlop={hitSlop} accessibilityLabel="Clear search">
          <Icon name="close-circle" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function FilterChip({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  count?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      {typeof count === 'number' && (
        <View style={[styles.chipCount, active && styles.chipCountActive]}>
          <Text style={[styles.chipCountText, active && styles.chipCountTextActive]}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {children}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Status pill / badge                                                 */
/* ------------------------------------------------------------------ */

export function StatusPill({ status, label, tone }: { status?: string; label?: string; tone?: Tone }) {
  const resolvedTone = tone ?? toneForStatus(status);
  const t = tones[resolvedTone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <View style={[styles.pillDot, { backgroundColor: t.dot }]} />
      <Text style={[styles.pillText, { color: t.fg }]}>{label ?? statusLabel(status)}</Text>
    </View>
  );
}

/** @deprecated use StatusPill — kept for compatibility */
export function Badge({ label, color }: { label: string; color?: string }) {
  if (color) {
    return (
      <View style={[styles.pill, { backgroundColor: color + '1A' }]}>
        <View style={[styles.pillDot, { backgroundColor: color }]} />
        <Text style={[styles.pillText, { color }]}>{label}</Text>
      </View>
    );
  }
  return <StatusPill status={label} label={statusLabel(label)} />;
}

/* ------------------------------------------------------------------ */
/* Empty / error / loading states                                      */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: IoniconName;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.state}>
      <View style={styles.stateIconWrap}>
        <Icon name={icon} size={30} color={colors.textTertiary} />
      </View>
      {title ? <Text style={styles.stateTitle}>{title}</Text> : null}
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="outline" size="sm" onPress={onAction} fullWidth={false} style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.state}>
      <View style={[styles.stateIconWrap, { backgroundColor: colors.errorSurface }]}>
        <Icon name="alert-circle-outline" size={30} color={colors.error} />
      </View>
      <Text style={styles.stateTitle}>Couldn't load this</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry && (
        <Button title="Retry" variant="outline" size="sm" onPress={onRetry} fullWidth={false} style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}

function Shimmer({ style }: { style: StyleProp<ViewStyle> }) {
  const opacity = useRef(new Animated.Value(0.35)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[style, { opacity, backgroundColor: colors.divider }]} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Shimmer style={{ width: 72, height: 20, borderRadius: radius.pill, marginBottom: spacing.sm }} />
      <Shimmer style={{ width: '70%', height: 18, borderRadius: 4, marginBottom: 8 }} />
      <Shimmer style={{ width: '45%', height: 14, borderRadius: 4 }} />
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar / list row / key-value row                                   */
/* ------------------------------------------------------------------ */

const AVATAR_COLORS = ['#F4A100', '#2563EB', '#16A34A', '#DC2626', '#7C3AED', '#0891B2'];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = 40, uri }: { name: string; size?: number; uri?: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';
  const bg = AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];

  if (uri) {
    return <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: colors.neutralSurface }} />;
  }

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg + '26' }]}>
      <Text style={[styles.avatarText, { color: bg, fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

export function ListItem({
  title,
  subtitle,
  leftIcon,
  onPress,
  trailing,
  destructive,
}: {
  title: string;
  subtitle?: string;
  leftIcon?: IoniconName;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}) {
  const content = (
    <View style={styles.listItem}>
      {leftIcon && (
        <View style={[styles.listItemIcon, destructive && { backgroundColor: colors.errorSurface }]}>
          <Icon name={leftIcon} size={18} color={destructive ? colors.error : colors.primaryDark} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.listItemTitle, destructive && { color: colors.error }]}>{title}</Text>
        {subtitle ? <Text style={styles.listItemSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing !== undefined ? trailing : onPress ? <Icon name="chevron-forward" size={18} color={colors.textTertiary} /> : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      {content}
    </TouchableOpacity>
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

/* ------------------------------------------------------------------ */
/* Toast                                                                */
/* ------------------------------------------------------------------ */

type ToastType = 'success' | 'error' | 'info';
interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(
    (message: string, type: ToastType = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ id: Date.now(), message, type });
      Animated.timing(anim, { toValue: 1, duration: duration.base, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: duration.base, useNativeDriver: true }).start(() => setToast(null));
      }, 2800);
    },
    [anim],
  );

  const value = useMemo(() => ({ show }), [show]);
  const toneFor: Record<ToastType, Tone> = { success: 'success', error: 'error', info: 'info' };
  const icon: Record<ToastType, IoniconName> = {
    success: 'checkmark-circle',
    error: 'alert-circle',
    info: 'information-circle',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastWrap,
            {
              bottom: insets.bottom + spacing.xxl,
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            },
          ]}
        >
          <View style={[styles.toast, { backgroundColor: tones[toneFor[toast.type]].fg }]}>
            <Icon name={icon[toast.type]} size={18} color={colors.white} />
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Styles                                                               */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },

  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: { ...typography.h3, color: colors.text },
  sectionHeaderAction: { ...typography.bodySmallMedium, color: colors.primaryDark },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardElevated: { borderWidth: 0, ...shadow.md },

  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  buttonSm: { paddingVertical: 10, paddingHorizontal: spacing.md, marginTop: 0 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonSecondary: { backgroundColor: colors.header },
  buttonDanger: { backgroundColor: colors.error },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonDisabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  buttonText: { ...typography.button },
  buttonTextSm: { fontSize: 13 },
  buttonTextDisabled: { color: colors.disabledText },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabWrap: { position: 'absolute', right: spacing.lg, bottom: spacing.xl },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lg,
  },

  inputWrap: { marginBottom: spacing.md },
  label: { ...typography.label, color: colors.text, marginBottom: 6 },
  required: { color: colors.error },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputBoxMultiline: { alignItems: 'flex-start', paddingVertical: 10 },
  inputBoxFocused: { borderColor: colors.primary },
  inputBoxError: { borderColor: colors.error },
  inputBoxDisabled: { backgroundColor: colors.disabledBg },
  inputPrefix: { color: colors.textSecondary, fontSize: 15, marginRight: 6 },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: colors.text },
  inputMultiline: { minHeight: 88, paddingTop: 2 },
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 6 },
  errorText: { ...typography.caption, color: colors.error, flex: 1, fontWeight: '600' },
  helperText: { ...typography.caption, color: colors.textSecondary, marginTop: 6 },

  selectBox: { justifyContent: 'space-between', paddingVertical: 13 },
  selectValue: { fontSize: 15, color: colors.text, flex: 1 },
  selectPlaceholder: { fontSize: 15, color: colors.textTertiary, flex: 1 },

  sheetOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  sheetList: { maxHeight: 420 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  sheetOptionTitle: { ...typography.bodyMedium, color: colors.text },
  sheetOptionSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },

  calendarCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, margin: spacing.lg, ...shadow.lg },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  calendarHeaderText: { ...typography.h3, color: colors.text },
  calendarWeekRow: { flexDirection: 'row', marginBottom: 4 },
  calendarWeekday: { flex: 1, textAlign: 'center', color: colors.textTertiary, fontSize: 12, fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calendarCellSelected: { backgroundColor: colors.primary, borderRadius: radius.pill },
  calendarDayText: { color: colors.text, fontSize: 14 },
  calendarDayTextSelected: { color: colors.white, fontWeight: '700' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: 11, marginLeft: 8, fontSize: 15, color: colors.text },

  chipRow: { paddingBottom: spacing.sm, gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { ...typography.bodySmallMedium, color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  chipCount: { marginLeft: 6, backgroundColor: colors.neutralSurface, borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1 },
  chipCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  chipCountText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  chipCountTextActive: { color: colors.white },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  pillText: { fontSize: 12, fontWeight: '700' },

  state: { paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl, alignItems: 'center' },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutralSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stateTitle: { ...typography.h3, color: colors.text, marginBottom: 4, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700' },

  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  listItemIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  listItemTitle: { ...typography.bodyMedium, color: colors.text },
  listItemSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: { color: colors.textSecondary, fontSize: 14 },
  rowValue: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' },

  toastWrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    ...shadow.lg,
    maxWidth: 480,
  },
  toastText: { color: colors.white, fontSize: 14, fontWeight: '600', marginLeft: 8, flexShrink: 1 },
});
