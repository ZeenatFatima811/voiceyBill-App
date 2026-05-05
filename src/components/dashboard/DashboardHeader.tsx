import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight } from '../../theme/colors';

interface DashboardHeaderProps {
  userName?: string;
  onAddTransaction: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName = 'User',
  onAddTransaction 
}) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome back, {userName}</Text>
          <Text style={styles.subtitle}>
            This is your overview report for the selected period
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddTransaction}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.navbar,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    textContainer: {
      flex: 1,
      marginRight: spacing.md,
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.medium,
      color: '#ffffff',
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    addButton: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
