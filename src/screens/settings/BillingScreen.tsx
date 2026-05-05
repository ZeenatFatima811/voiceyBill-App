import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight } from '../../theme/colors';

export default function BillingScreen() {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const styles = createStyles(themeColors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>💳</Text>
          <Text style={styles.placeholderTitle}>Billing & Subscription</Text>
          <Text style={styles.placeholderText}>
            Manage your subscription, payment methods, and billing history here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholder: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    placeholderIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    placeholderTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: theme.foreground,
      marginBottom: spacing.md,
    },
    placeholderText: {
      fontSize: fontSize.md,
      color: theme.mutedForeground,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
