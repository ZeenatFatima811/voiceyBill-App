import * as FileSystem from 'expo-file-system';

export type TranscodedFile = { uri: string; mime: string; name: string };

// Try to transcode any input file to WAV (PCM 16-bit mono 44.1kHz) using ffmpeg-kit if available.
// Returns null if ffmpeg-kit is not installed or transcode fails.
export async function transcodeToWav(inputUri: string): Promise<TranscodedFile | null> {
  try {
    // Dynamic import so app still runs in Expo Go without ffmpeg-kit
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('ffmpeg-kit-react-native');
    const FFmpegKit: any = (mod as any).FFmpegKit;
    const ReturnCode: any = (mod as any).ReturnCode;

    // Prepare paths without file:// for ffmpeg
    const inPath = inputUri.replace('file://', '');
    const outUri = `${FileSystem.cacheDirectory}voice-${Date.now()}.wav`;
    const outPath = outUri.replace('file://', '');

    const cmd = `-y -i "${inPath}" -ar 44100 -ac 1 -sample_fmt s16 -f wav "${outPath}"`;
    const session = await FFmpegKit.execute(cmd);
    const rc = await session.getReturnCode();

    if (ReturnCode.isSuccess(rc)) {
      return { uri: outUri, mime: 'audio/wav', name: 'recording.wav' };
    }

    return null;
  } catch (e) {
    // ffmpeg-kit not installed or failed
    return null;
  }
}
