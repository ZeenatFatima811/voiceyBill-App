import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/colors';

interface SummaryCardProps {
  title: string;
  value: string;
  theme: any;
  icon?: string; // emoji or short text icon
  color?: string;
}

export default function SummaryCard({ title, value, theme, icon, color }: SummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: (color || theme.primary) + '20' }]}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
      )}
      <Text style={[styles.cardTitle, { color: theme.mutedForeground }]}>{title}</Text>
      <Text style={[styles.balance, { color: theme.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  balance: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
  },
});
