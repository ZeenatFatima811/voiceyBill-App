import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, ClipPath, Path, Line, G } from 'react-native-svg';
import { spacing, fontSize, fontWeight } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';

type LogoProps = { centered?: boolean; size?: 'md' | 'lg' };

export default function Logo({ centered = true, size = 'md' }: LogoProps) {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const isLg = size === 'lg';
  const iconDim = isLg ? 40 : 28;
  const brandFs = isLg ? fontSize['3xl'] : fontSize.lg;

  return (
    <View style={[styles.row, centered && { justifyContent: 'center' }]}>
      <Svg width={iconDim} height={iconDim} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="vb-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#22c55e" />
            <Stop offset="1" stopColor="#0d9488" />
          </LinearGradient>
          <LinearGradient id="vb-sheen" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <Stop stopColor="white" stopOpacity="0.15" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </LinearGradient>
          <ClipPath id="vb-mc">
            <Rect x="36" y="8" width="28" height="44" rx="14" />
          </ClipPath>
        </Defs>
        <Rect width="100" height="100" rx="22" fill="url(#vb-bg)" />
        <Rect width="100" height="50" rx="22" fill="url(#vb-sheen)" />
        <Rect x="36" y="8" width="28" height="44" rx="14" fill="white" />
        <G clipPath="url(#vb-mc)">
          <Rect x="40.5" y="28" width="5.5" height="24" rx="2" fill="#16a34a" opacity="0.75" />
          <Rect x="47.5" y="16" width="5.5" height="36" rx="2" fill="#15803d" opacity="0.9" />
          <Rect x="54.5" y="22" width="5.5" height="30" rx="2" fill="#16a34a" opacity="0.75" />
        </G>
        <Path d="M20 52 Q20 76 50 76 Q80 76 80 52" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <Line x1="50" y1="76" x2="50" y2="86" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <Line x1="34" y1="86" x2="66" y2="86" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </Svg>
      <Text style={[styles.brand, { color: themeColors.foreground, fontSize: brandFs }]}>VoiceyBill</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brand: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
