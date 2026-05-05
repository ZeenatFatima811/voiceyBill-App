import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://voiceybill-server.vercel.app/api';
console.log('[API] Backend URL:', API_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set('Authorization', `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

export const apiClient = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true,
  tagTypes: ['transactions', 'analytics', 'billingSubscription', 'reports', 'user', 'Analytics'],
  endpoints: () => ({}),
});
