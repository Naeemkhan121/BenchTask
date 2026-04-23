import type { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import type { ToastConfig } from 'react-native-toast-message';
import { BaseToast } from 'react-native-toast-message';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

const styles = StyleSheet.create({
  base: {
    borderLeftColor: colors.primary_container,
    backgroundColor: colors.surface_container_high,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
  text1: {
    ...typography['title-sm'],
    color: colors.on_surface,
  },
});

export const toastConfig: ToastConfig = {
  info: (params): ReactElement => {
    const { text1, text2, onPress, text1Style, text2Style } = params;
    return (
      <BaseToast
        contentContainerStyle={styles.contentContainer}
        style={styles.base}
        text1={text1}
        text1Style={[text1Style, styles.text1]}
        text2={text2}
        text2Style={text2Style}
        onPress={onPress}
      />
    );
  },
};
