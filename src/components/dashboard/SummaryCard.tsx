import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/colors';
import { Card, CardHeader, CardContent } from '../common/Card';

interface SummaryCardProps {
  title: string;
  value: number;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  cardType: 'balance' | 'income' | 'expenses' | 'savings';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value = 0,
  percentageChange,
  isPercentageValue = false,
  isLoading = false,
  cardType,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const styles = createStyles(themeColors);

  const formatValue = (val: number) => {
    if (isPercentageValue) {
      return `${val.toFixed(1)}%`;
    }
    const sign = cardType === 'balance' && val < 0 ? '-' : '';
    const absVal = Math.abs(val);
    return `${sign}₨${absVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTrendColor = () => {
    if (!percentageChange || percentageChange === 0) return themeColors.mutedForeground;
    
    if (cardType === 'expenses') {
      return percentageChange <= 0 ? '#10b981' : '#ef4444';
    }
    return percentageChange >= 0 ? '#10b981' : '#ef4444';
  };

  const showTrend = percentageChange !== undefined && percentageChange !== null && cardType !== 'savings';

  if (isLoading) {
    return (
      <Card variant="stats">
        <CardHeader>
          <View style={styles.loadingSkeleton} />
        </CardHeader>
        <CardContent>
          <View style={[styles.loadingSkeleton, { height: 32, marginBottom: spacing.lg }]} />
          <View style={[styles.loadingSkeleton, { height: 14, width: '60%' }]} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="stats">
      <CardHeader>
        <Text style={styles.cardTitle}>{title}</Text>
      </CardHeader>
      <CardContent style={styles.content}>
        <Text
          style={[
            styles.value,
            cardType === 'balance' && value < 0 && styles.negativeValue,
          ]}
        >
          {formatValue(value)}
        </Text>

        {showTrend && (
          <View style={styles.trendContainer}>
            {percentageChange !== 0 && (
              <>
                {percentageChange > 0 ? (
                  <TrendingUp size={14} color={getTrendColor()} />
                ) : (
                  <TrendingDown size={14} color={getTrendColor()} />
                )}
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {Math.abs(percentageChange).toFixed(1)}%
                </Text>
              </>
            )}
            {percentageChange === 0 && (
              <>
                <TrendingDown size={14} color={themeColors.mutedForeground} />
                <Text style={[styles.trendText, { color: themeColors.mutedForeground }]}>
                  0.0%
                </Text>
              </>
            )}
          </View>
        )}

        {cardType === 'savings' && (
          <View style={styles.trendContainer}>
            {value > 0 ? (
              <>
                <TrendingUp size={14} color="#10b981" />
                <Text style={[styles.trendText, { color: '#10b981' }]}>
                  Good Savings
                </Text>
              </>
            ) : (
              <>
                <TrendingDown size={14} color="#64748b" />
                <Text style={[styles.trendText, { color: '#64748b' }]}>
                  No Savings
                </Text>
              </>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    cardTitle: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: '#d1d5db', // text-gray-300
    },
    content: {
      gap: spacing.md,
    },
    value: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: '#ffffff',
    },
    negativeValue: {
      color: '#f87171', // red-400
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    trendText: {
      fontSize: fontSize.sm,
    },
    loadingSkeleton: {
      height: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: borderRadius.sm,
      width: '50%',
    },
  });
