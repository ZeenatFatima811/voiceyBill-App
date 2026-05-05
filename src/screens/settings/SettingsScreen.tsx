import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { User, Palette } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/colors';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const menuItems = [
    { title: 'Account', screen: 'Account', icon: User },
    { title: 'Appearance', screen: 'Appearance', icon: Palette },
  ];

  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>Settings</Text>
          <Text style={styles.navbarSubtitle}>
            Manage your account settings and set e-mail preferences.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.sidebar}>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.screen}
                    style={styles.menuItem}
                    onPress={() => navigation.navigate(item.screen as never)}
                    activeOpacity={0.7}
                  >
                    <IconComponent size={18} color={themeColors.foreground} />
                    <Text style={styles.menuTitle}>{item.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    navbar: {
      backgroundColor: theme.navbar,
      padding: spacing.lg,
      paddingTop: spacing.xl + 20,
    },
    navbarTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: theme.navbarForeground,
    },
    navbarSubtitle: {
      fontSize: fontSize.sm,
      color: theme.navbarForeground,
      opacity: 0.9,
      marginTop: spacing.xs,
    },
    content: {
      padding: spacing.lg,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sidebar: {
      gap: spacing.xs,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: 'transparent',
    },
    menuTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: theme.foreground,
    },
  });
