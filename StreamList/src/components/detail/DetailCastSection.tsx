import type { ReactElement } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { CastMember } from '../../api/types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildProfileUrl } from '../../utils/image';

export interface DetailCastSectionProps {
  cast: CastMember[];
}

export function DetailCastSection({
  cast,
}: DetailCastSectionProps): ReactElement {
  if (cast.length === 0) {
    return (
      <Text style={styles.unavailable}>
        Cast information unavailable
      </Text>
    );
  }

  return (
    <>
      <Text style={styles.sectionTitle}>Cast</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {cast.map((c, index) => {
          const uri = buildProfileUrl(c.profile_path);
          return (
            <View
              key={c.id}
              style={[styles.card, index < cast.length - 1 && styles.cardSpacer]}
            >
              <View style={styles.avatarWrap}>
                {uri.length > 0 ? (
                  <Image
                    accessibilityIgnoresInvertColors
                    source={{ uri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]} />
                )}
              </View>
              <Text numberOfLines={2} style={styles.actor}>
                {c.name}
              </Text>
              <Text numberOfLines={2} style={styles.character}>
                {c.character}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingRight: spacing.md,
    flexDirection: 'row',
  },
  card: {
    width: layout.castAvatarSize + spacing.md,
    alignItems: 'center',
  },
  cardSpacer: {
    marginRight: spacing.md,
  },
  avatarWrap: {
    borderRadius: layout.castAvatarSize / 2,
    overflow: 'hidden',
  },
  avatar: {
    width: layout.castAvatarSize,
    height: layout.castAvatarSize,
    borderRadius: layout.castAvatarSize / 2,
    backgroundColor: colors.surface_container_high,
  },
  avatarPlaceholder: {
    opacity: 0.6,
  },
  actor: {
    ...typography['label-sm'],
    color: colors.on_surface,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  character: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs / 2,
    textAlign: 'center',
  },
  unavailable: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.lg,
  },
});
