import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ProfileScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
});
