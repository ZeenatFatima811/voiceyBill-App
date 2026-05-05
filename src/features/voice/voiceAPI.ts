import { apiClient } from '../../store/api-client';

export interface VoiceProcessResponse {
  success: boolean;
  message: string;
  data: {
    title?: string;
    amount?: number;
    date?: string;
    description?: string;
    category?: string;
    paymentMethod?: string;
    type?: 'INCOME' | 'EXPENSE';
    voiceUrl?: string;
    transcription?: string;
    confidence?: number;
    error?: string;
  };
}

export const voiceApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // EXACTLY match receipt scan structure - no extra logging or transforms
    processVoice: builder.mutation<VoiceProcessResponse, FormData>({
      query: (formData) => ({
        url: '/voice/process',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useProcessVoiceMutation } = voiceApi;
