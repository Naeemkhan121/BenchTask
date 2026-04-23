import type { ReactElement } from 'react';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  onFocus,
  onBlur,
}: SearchBarProps): ReactElement {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inner,
          focused && styles.innerFocused,
        ]}
      >
        <MaterialCommunityIcons
          color={colors.on_surface_variant}
          name="magnify"
          size={layout.iconSizeMd}
          style={styles.icon}
        />
        <TextInput
          accessibilityLabel="Search movies, actors, directors"
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          placeholder="Search movies, actors, directors..."
          placeholderTextColor={colors.on_surface_variant}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: layout.searchBarRadius,
    paddingHorizontal: spacing.md,
    minHeight: spacing.xl + spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  innerFocused: {
    borderWidth: 1,
    borderColor: colors.outline_variant,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography['body-md'],
    color: colors.on_surface,
    paddingVertical: spacing.sm,
  },
});
