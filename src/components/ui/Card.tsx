import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CardHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

interface CardDescriptionProps {
  children: ReactNode;
  style?: TextStyle;
}

interface CardContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardFooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style, shadow = 'none' }) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
        shadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  return (
    <Text
      style={[
        styles.cardTitle,
        { color: themeColors.cardForeground },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  return (
    <Text
      style={[
        styles.cardDescription,
        { color: themeColors.mutedForeground },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardFooter, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * 1.2,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    lineHeight: fontSize.sm * 1.5,
  },
  cardContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardFooter: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
