import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { FileX } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import { ExpenseBreakdown } from '../../features/analytics/analyticsAPI';
import { formatCurrency } from '../../lib/formatCurrency';

const { width } = Dimensions.get('window');

export default function ExpenseBreakdownPie({ breakdown, total }: { breakdown: ExpenseBreakdown[]; total: number }) {
  const { activeTheme } = useTheme();
  const theme = colors[activeTheme];

  // Sizing - match web: innerRadius 60, outerRadius 80, so strokeWidth = 20
  const chartMaxWidth = width - spacing.lg * 2;
  const innerRadius = 60;
  const outerRadius = 80;
  const strokeWidth = outerRadius - innerRadius; // 20
  const radius = innerRadius + strokeWidth / 2; // 70 (center of stroke)
  const center = outerRadius + 10; // Add padding
  const svgSize = center * 2;
  const size = Math.min(svgSize, Math.max(200, Math.min(300, chartMaxWidth)));
  const scale = size / svgSize;

  // Colors matching web's chart colors (light & dark mode)
  const palette = useMemo(() => {
    if (activeTheme === 'dark') {
      return [
        '#6366F1', // chart-1 dark (indigo)
        '#4ADE80', // chart-2 dark (green - primary)
        '#FACC15', // chart-3 dark (yellow)
        '#C084FC', // chart-4 dark (purple)
        '#FB923C', // chart-5 dark (orange)
      ];
    }
    return [
      '#FF6B35', // chart-1 light (orange-red)
      '#22D3EE', // chart-2 light (cyan)
      '#4F46E5', // chart-3 light (indigo)
      '#FDE047', // chart-4 light (yellow)
      '#FACC15', // chart-5 light (amber)
    ];
  }, [activeTheme]);

  // Build arcs - filter out zero values to show ALL non-zero categories
  const segments = useMemo(() => {
    const valid = (breakdown || []).filter((b) => b.value > 0 && b.percentage > 0);
    if (!valid.length || total <= 0) return [] as Array<{ d: string; color: string; index: number }>;

    let start = -90;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const polar = (cx: number, cy: number, r: number, a: number) => ({ 
      x: cx + r * Math.cos(toRad(a)), 
      y: cy + r * Math.sin(toRad(a)) 
    });
    const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
      const p0 = polar(cx, cy, r, a0);
      const p1 = polar(cx, cy, r, a1);
      const largeArc = a1 - a0 <= 180 ? '0' : '1';
      return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
    };

    return valid.map((b, idx) => {
      const sweep = (b.percentage / 100) * 360;
      const end = start + sweep;
      const d = arcPath(center, center, radius, start, end);
      const seg = { d, color: palette[idx % palette.length], index: idx };
      start = end;
      return seg;
    });
  }, [breakdown, total, center, radius, palette]);

  const showEmpty = total <= 0 || segments.length === 0;
  
  // Only show non-zero categories in legend (match web behavior)
  const validBreakdown = useMemo(() => {
    return (breakdown || []).filter((b) => b.value > 0 && b.percentage > 0);
  }, [breakdown]);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
      {/* Donut or Empty */}
      {showEmpty ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: activeTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' }}>
            <FileX size={28} color={theme.mutedForeground} strokeWidth={1.5} />
          </View>
          <Text style={{ marginTop: spacing.md, color: theme.foreground, fontWeight: fontWeight.bold, fontSize: fontSize.base }}>No expenses found</Text>
          <Text style={{ marginTop: spacing.xs, color: theme.mutedForeground, fontSize: fontSize.sm, textAlign: 'center', paddingHorizontal: spacing.lg }}>
            There are no expenses recorded for this period.
          </Text>
        </View>
      ) : (
        <>
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md }}>
            <View style={{ position: 'relative' }}>
              <Svg width={size} height={size} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <G>
                  {/* Background circle with padding=2 stroke */}
                  <Circle 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    stroke={activeTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                    strokeWidth={strokeWidth} 
                    fill="none" 
                  />
                  {/* Segments with paddingAngle effect via stroke */}
                  {segments.map((seg, i) => (
                    <Path
                      key={`seg-${i}`}
                      d={seg.d}
                      stroke={seg.color}
                      strokeWidth={strokeWidth - 1} // Slightly smaller for padding effect
                      fill="none"
                      strokeLinecap="butt"
                    />
                  ))}
                </G>
              </Svg>
              {/* Center overlay - properly centered */}
              <View 
                style={[
                  styles.centerOverlay, 
                  { 
                    width: size, 
                    height: size,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }
                ]} 
                pointerEvents="none"
              >
                <Text style={[styles.centerValue, { color: theme.foreground }]}>
                  ₨{total.toLocaleString()}
                </Text>
                <Text style={[styles.centerLabel, { color: theme.mutedForeground }]}>Total Spent</Text>
              </View>
            </View>
          </View>

          {/* Legend - only show non-zero categories */}
          <View style={{ marginTop: spacing.md }}>
            {validBreakdown.map((b, idx) => (
              <View 
                key={`legend-${idx}`} 
                style={[
                  styles.legendRow, 
                  { borderColor: theme.border }
                ]}
              > 
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                  <View style={[styles.legendDot, { backgroundColor: palette[idx % palette.length] }]} />
                  <Text style={{ color: theme.foreground, fontSize: fontSize.xs, fontWeight: fontWeight.medium, textTransform: 'capitalize' }}>
                    {b.name}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Text style={{ color: theme.mutedForeground, fontSize: fontSize.xs }}>
                    {formatCurrency(b.value)}
                  </Text>
                  <Text style={{ color: theme.mutedForeground, fontSize: fontSize.xs, opacity: 0.6 }}>
                    ({Math.round(b.percentage)}%)
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  centerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  centerLabel: {
    fontSize: fontSize.xs,
    marginTop: 4,
    textAlign: 'center',
  },
  legendRow: {
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
