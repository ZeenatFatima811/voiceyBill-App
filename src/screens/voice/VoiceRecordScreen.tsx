import React from 'react';
import { View, StyleSheet } from 'react-native';

// This is a placeholder screen - user never actually sees it
// The Voice tab redirects to Transactions with voice mode via tab listener
export default function VoiceRecordScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
