import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, FileX } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { ChartDataPoint } from '../../features/analytics/analyticsAPI';

const { width } = Dimensions.get('window');

type Props = {
  data: ChartDataPoint[];
  totalIncomeCount?: number;
  totalExpenseCount?: number;
  periodLabel?: string;
};

export default function TransactionOverviewChart({ 
  data, 
  totalIncomeCount = 0, 
  totalExpenseCount = 0, 
  periodLabel = 'Past 30 Days' 
}: Props) {
  const { activeTheme } = useTheme();
  const theme = colors[activeTheme];

  const labels = data.map((d) => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const income = data.map((d) => d.income || 0);
  const expenses = data.map((d) => d.expenses || 0);
  const hasData = (data?.length || 0) > 0 && (income.some((v) => v > 0) || expenses.some((v) => v > 0));

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
      {/* Header Section - matching web layout */}
      <View style={styles.header}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.foreground }]}>Transaction Overview</Text>
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
            Showing total transactions {periodLabel}
          </Text>
        </View>

        {/* Stats Section - matching web's two-column layout */}
        <View style={styles.statsSection}>
          {/* Income Count */}
          <View style={[styles.statBox, { borderRightWidth: 1, borderRightColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>
              No of Income
            </Text>
            <View style={styles.statValueRow}>
              <TrendingUp size={12} color={theme.primary} strokeWidth={2} />
              <Text style={[styles.statValue, { color: theme.foreground }]}>
                {totalIncomeCount}
              </Text>
            </View>
          </View>

          {/* Expenses Count */}
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>
              No of Expenses
            </Text>
            <View style={styles.statValueRow}>
              <TrendingDown size={12} color={theme.destructive} strokeWidth={2} />
              <Text style={[styles.statValue, { color: theme.foreground }]}>
                {totalExpenseCount}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Chart or Empty State */}
      {hasData ? (
        <>
          <LineChart
            data={{
              labels,
              datasets: [
                { data: expenses, color: () => theme.destructive, strokeWidth: 2 },
                { data: income, color: () => theme.primary, strokeWidth: 2 },
              ],
            }}
            width={width - spacing.lg * 4}
            height={240}
            withShadow={false}
            withDots
            transparent={false}
            chartConfig={{
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              color: () => theme.foreground,
              labelColor: () => theme.mutedForeground,
              decimalPlaces: 0,
              propsForDots: {
                r: '3',
              },
              propsForBackgroundLines: { 
                strokeDasharray: '3 3', 
                stroke: activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
              propsForLabels: { fontSize: 10 },
            }}
            bezier
            style={{ marginTop: spacing.sm, marginLeft: -spacing.md }}
          />
          
          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.legendText, { color: theme.foreground }]}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.destructive }]} />
              <Text style={[styles.legendText, { color: theme.foreground }]}>Expenses</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconWrap, { 
            backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' 
          }]}>
            <FileX size={28} color={theme.mutedForeground} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
            No transaction data
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.mutedForeground }]}>
            There are no transactions recorded for this period.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: 0,
    overflow: 'hidden',
  },
  // Header section with title and stats
  header: {
    flexDirection: 'column',
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  // Stats section matching web's layout
  statsSection: {
    flexDirection: 'row',
  },
  statBox: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: fontWeight.semibold,
  },
  // Divider between header and chart
  divider: {
    height: 1,
  },
  // Legend
  legendRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
