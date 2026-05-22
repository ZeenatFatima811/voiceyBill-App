import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { Home, Wallet, Mic, BarChart3, Settings } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import VoiceRecordScreen from '../screens/voice/VoiceRecordScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import SettingsNavigator from './SettingsNavigator';

export type MainTabParamList = {
  Overview: undefined;
  Transactions: { openVoiceMode?: number } | undefined;
  Voice: undefined;
  Reports: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.mutedForeground,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Wallet size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceRecordScreen}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={props.onPress}
              style={styles.voiceTabContainer}
              accessibilityRole="button"
              accessibilityLabel="Record voice transaction"
            >
              <View style={[styles.voiceFab, { backgroundColor: themeColors.primary }]}>
                <Mic size={26} color={themeColors.primaryForeground} />
              </View>
            </TouchableOpacity>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Transactions', { openVoiceMode: Date.now() });
          },
        })}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  voiceTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -14 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
