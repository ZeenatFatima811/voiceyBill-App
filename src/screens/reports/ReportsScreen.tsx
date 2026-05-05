import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, Trash2, Calendar, FileText, Mail } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/colors';
import { useGetAllReportsQuery, useDownloadReportMutation, useDeleteReportMutation } from '../../features/report/reportAPI';
import { format } from 'date-fns';

export default function ReportsScreen() {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching, refetch } = useGetAllReportsQuery({
    pageNumber: page,
    pageSize,
  });

  const [downloadReport] = useDownloadReportMutation();
  const [deleteReport] = useDeleteReportMutation();

  const reports = data?.data?.reports || [];
  const pagination = data?.data?.pagination;

  const handleDownload = async (reportId: string, type: string) => {
    try {
      const result = await downloadReport(reportId).unwrap();
      if (result.fileUrl) {
        Alert.alert('Success', 'Report downloaded successfully');
        // In a real app, you'd open the URL or download the file
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download report');
    }
  };

  const handleDelete = (reportId: string) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReport(reportId).unwrap();
              Alert.alert('Success', 'Report deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete report');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return themeColors.mutedForeground;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View style={styles.navbar}>
          <View>
            <Text style={styles.navbarTitle}>Report History</Text>
            <Text style={styles.navbarSubtitle}>
              View and manage your financial reports
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            {/* Loading State */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                <Text style={styles.loadingText}>Loading reports...</Text>
              </View>
            )}

            {/* Empty State */}
            {!isLoading && reports.length === 0 && (
              <View style={styles.emptyState}>
                <FileText size={64} color={themeColors.mutedForeground} />
                <Text style={styles.emptyTitle}>No Reports Yet</Text>
                <Text style={styles.emptyText}>
                  Your generated financial reports will appear here.
                </Text>
              </View>
            )}

            {/* Reports List */}
            {!isLoading && reports.length > 0 && (
              <View style={styles.reportsList}>
                {reports.map((report) => (
                  <View key={report._id} style={styles.reportItem}>
                    <View style={styles.reportHeader}>
                      <View style={styles.reportInfo}>
                        <View style={styles.reportIconContainer}>
                          <FileText size={20} color={themeColors.primary} />
                        </View>
                        <View style={styles.reportDetails}>
                          <Text style={styles.reportType}>
                            {report.type || 'Financial Report'}
                          </Text>
                          <View style={styles.reportMeta}>
                            <Calendar size={14} color={themeColors.mutedForeground} />
                            <Text style={styles.reportDate}>
                              {formatDate(report.startDate)} - {formatDate(report.endDate)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(report.status) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(report.status) },
                          ]}
                        >
                          {getStatusLabel(report.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.reportFooter}>
                      <Text style={styles.generatedText}>
                        Generated: {formatDate(report.generatedAt)}
                      </Text>
                      <View style={styles.reportActions}>
                        {report.status === 'completed' && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDownload(report._id, report.type)}
                          >
                            <Download size={18} color={themeColors.primary} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(report._id)}
                        >
                          <Trash2 size={18} color={themeColors.destructive} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    page === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      page === 1 && styles.paginationButtonTextDisabled,
                    ]}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>
                <Text style={styles.paginationInfo}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    page === pagination.totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      page === pagination.totalPages &&
                        styles.paginationButtonTextDisabled,
                    ]}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    loadingContainer: {
      padding: spacing.xl * 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: fontSize.md,
      color: theme.mutedForeground,
    },
    emptyState: {
      padding: spacing.xl * 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: theme.foreground,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: theme.mutedForeground,
      textAlign: 'center',
      lineHeight: 22,
    },
    reportsList: {
      gap: spacing.md,
    },
    reportItem: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      backgroundColor: theme.background,
    },
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    reportInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    reportIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    reportDetails: {
      flex: 1,
    },
    reportType: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: theme.foreground,
      marginBottom: spacing.xs,
    },
    reportMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    reportDate: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
    },
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      textTransform: 'uppercase',
    },
    reportFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    generatedText: {
      fontSize: fontSize.xs,
      color: theme.mutedForeground,
    },
    reportActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      backgroundColor: theme.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    paginationButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    paginationButtonDisabled: {
      opacity: 0.5,
    },
    paginationButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: theme.foreground,
    },
    paginationButtonTextDisabled: {
      color: theme.mutedForeground,
    },
    paginationInfo: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
    },
  });
