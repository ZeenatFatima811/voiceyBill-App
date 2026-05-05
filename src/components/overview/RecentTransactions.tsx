import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Calendar, Tag } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { useGetAllTransactionsQuery } from '../../features/transaction/transactionAPI';
import { formatCurrency } from '../../lib/formatCurrency';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

export default function RecentTransactions() {
  const { activeTheme } = useTheme();
  const theme = colors[activeTheme];
  const navigation = useNavigation();

  const { data, isLoading } = useGetAllTransactionsQuery({
    pageNumber: 1,
    pageSize: 10,
  });
  const transactions = data?.transations || [];

  const renderTransactionCard = ({ item }: { item: any }) => {
    const isIncome = item.type === 'INCOME';
    const IconComponent = isIncome ? ArrowUpRight : ArrowDownRight;
    const iconColor = isIncome ? theme.primary : theme.destructive;
    const amountColor = isIncome ? theme.primary : theme.destructive;

    return (
      <View style={[styles.transactionCard, { 
        backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderColor: theme.border,
      }]}>
        {/* Left: Icon + Content */}
        <View style={styles.cardLeft}>
          {/* Icon Circle */}
          <View style={[styles.iconCircle, { 
            backgroundColor: isIncome 
              ? (activeTheme === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(74, 222, 128, 0.1)') 
              : (activeTheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')
          }]}>
            <IconComponent size={20} color={iconColor} strokeWidth={2} />
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={[styles.transactionTitle, { color: theme.foreground }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Tag size={12} color={theme.mutedForeground} strokeWidth={2} />
                <Text style={[styles.metaText, { color: theme.mutedForeground }]} numberOfLines={1}>
                  {item.category}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={12} color={theme.mutedForeground} strokeWidth={2} />
                <Text style={[styles.metaText, { color: theme.mutedForeground }]}>
                  {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right: Amount */}
        <View style={styles.cardRight}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {formatCurrency(item.amount, { showSign: true, isExpense: !isIncome })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.foreground }]}>Recent Transactions</Text>
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
            Showing all recent transactions
          </Text>
        </View>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Transactions')}>
          <Text style={[styles.viewAll, { color: theme.primary }]}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransactionCard}
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
                No recent transactions
              </Text>
            </View>
          ) : null
        }
        scrollEnabled={false}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
  },
  viewAll: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  divider: {
    height: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  // Transaction Card (mobile-friendly)
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  transactionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSize.xs,
  },
  cardRight: {
    marginLeft: spacing.sm,
  },
  amount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
  },
});
