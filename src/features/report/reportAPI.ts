import { apiClient } from '../../store/api-client';

// Report Types
export interface Report {
  _id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  fileUrl?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ReportSetting {
  _id: string;
  userId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'none';
  reportType: string;
  emailDelivery: boolean;
  isActive: boolean;
  lastSent?: string;
  nextScheduled?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllReportResponse {
  message: string;
  data: {
    reports: Report[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReports: number;
      pageSize: number;
    };
  };
}

export interface UpdateReportSettingParams {
  frequency: 'daily' | 'weekly' | 'monthly' | 'none';
  reportType: string;
  emailDelivery: boolean;
  isActive: boolean;
}

export const reportApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query<
      GetAllReportResponse,
      { pageNumber?: number; pageSize?: number }
    >({
      query: (params) => {
        const { pageNumber = 1, pageSize = 20 } = params;
        return {
          url: '/report/all',
          method: 'GET',
          params: { pageNumber, pageSize },
        };
      },
      providesTags: ['reports'],
    }),

    updateReportSetting: builder.mutation<void, UpdateReportSettingParams>({
      query: (payload) => ({
        url: '/report/update-setting',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['reports'],
    }),

    downloadReport: builder.mutation<{ fileUrl: string }, string>({
      query: (reportId) => ({
        url: `/report/download/${reportId}`,
        method: 'GET',
      }),
    }),

    deleteReport: builder.mutation<void, string>({
      query: (reportId) => ({
        url: `/report/delete/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['reports'],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useUpdateReportSettingMutation,
  useDownloadReportMutation,
  useDeleteReportMutation,
} = reportApi;
