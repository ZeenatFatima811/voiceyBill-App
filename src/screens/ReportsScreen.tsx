import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileText, TrendingUp, Calendar } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme/colors';
import { Card, CardHeader, CardContent } from '../components/common/Card';

export default function ReportsScreen() {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerSubtitle}>
            View your financial reports and insights
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Cards */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.cardIconRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#10b98120' }]}>
                  <FileText size={24} color="#10b981" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Monthly Reports</Text>
                  <Text style={styles.cardSubtitle}>Coming Soon</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.cardDescription}>
                Get detailed monthly breakdowns of your income, expenses, and savings.
              </Text>
            </CardContent>
          </Card>

          <Card style={{ marginTop: spacing.md }}>
            <CardHeader>
              <View style={styles.cardIconRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#3b82f620' }]}>
                  <TrendingUp size={24} color="#3b82f6" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Trend Analysis</Text>
                  <Text style={styles.cardSubtitle}>Coming Soon</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.cardDescription}>
                Analyze spending patterns and financial trends over time.
              </Text>
            </CardContent>
          </Card>

          <Card style={{ marginTop: spacing.md }}>
            <CardHeader>
              <View style={styles.cardIconRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#f59e0b20' }]}>
                  <Calendar size={24} color="#f59e0b" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Custom Reports</Text>
                  <Text style={styles.cardSubtitle}>Coming Soon</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.cardDescription}>
                Create custom reports with date ranges and specific categories.
              </Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: theme.navbar,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    headerTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.medium,
      color: '#ffffff',
      marginBottom: spacing.xs,
    },
    headerSubtitle: {
      fontSize: fontSize.sm,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    scrollView: {
      flex: 1,
      marginTop: -spacing.xl,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
    cardIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitleContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: theme.foreground,
    },
    cardSubtitle: {
      fontSize: fontSize.xs,
      color: theme.mutedForeground,
      marginTop: spacing.xs - 2,
    },
    cardDescription: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
      lineHeight: 20,
    },
  });
