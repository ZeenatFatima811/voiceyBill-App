import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import lamejs from 'lamejs';
import { Mic, Play, Pause, Square } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme/colors';
import { useProcessVoiceMutation } from '../../features/voice/voiceAPI';

interface VoiceRecorderProps {
  loadingChange: boolean;
  onLoadingChange: (loading: boolean) => void;
  onVoiceComplete: (data: any) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  loadingChange,
  onLoadingChange,
  onVoiceComplete,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ mime: string; name: string } | null>(null);

  const recording = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [processVoice] = useProcessVoiceMutation();

  // Pulse animation for recording indicator
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const rec = new Audio.Recording();
      
      // Use HIGH_QUALITY preset which produces M4A
      // We'll convert M4A to MP3 or send directly to backend
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      
      setFileMeta({ mime: 'audio/mpeg', name: 'recording.mp3' });
      await rec.startAsync();

      recording.current = rec;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (recording.current && isRecording) {
        await recording.current.stopAndUnloadAsync();
        const uri = recording.current.getURI();

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
        } catch {}

        setIsRecording(false);
        recording.current = null;

        if (uri) {
          setRecordedUri(uri);
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      recording.current = null;
    }
  };

  const playAudio = async () => {
    try {
      if (!recordedUri) return;

      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish || !status.isPlaying) {
            setIsPlaying(false);
          }
        });
      }

      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  };

  const clearRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }

    setRecordedUri(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const convertAudioToMp3 = async (audioUri: string): Promise<string> => {
    // Check file extension to determine conversion method
    const fileExt = audioUri.split('.').pop()?.toLowerCase();
    console.log('Converting audio file with extension:', fileExt);
    
    if (fileExt === 'wav') {
      return await convertWavToMp3(audioUri);
    } else if (fileExt === 'm4a' || fileExt === 'mp4' || fileExt === 'aac') {
      // M4A/AAC files cannot be converted to MP3 in pure JavaScript
      // We'll need to send them as-is and hope the backend accepts them
      // OR throw error to use original file
      console.warn('M4A format detected - conversion not supported, using original file');
      throw new Error('SKIP_CONVERSION'); // Special error to skip conversion
    } else {
      throw new Error(`Unsupported audio format: ${fileExt}`);
    }
  };

  const convertWavToMp3 = async (wavUri: string): Promise<string> => {
    try {
      console.log('Starting MP3 conversion for:', wavUri);
      
      // Read the WAV file as base64
      const wavData = await FileSystem.readAsStringAsync(wavUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('WAV data read, size:', wavData.length);

      // Convert base64 to array buffer
      const binaryString = atob(wavData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('Binary data converted, size:', bytes.length);

      // Parse WAV header
      const dataView = new DataView(bytes.buffer);
      
      // Verify WAV format
      const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
      const wave = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
      
      console.log('WAV header check - RIFF:', riff, 'WAVE:', wave);
      
      if (riff !== 'RIFF' && wave !== 'WAVE') {
        // Not a WAV file, might be M4A or other format
        console.warn('Not a WAV file, attempting direct upload...');
        throw new Error('Invalid WAV format');
      }

      // Find 'data' chunk
      let dataStart = -1;
      let dataSize = 0;
      
      for (let i = 12; i < bytes.length - 8; i++) {
        if (
          bytes[i] === 100 &&     // 'd'
          bytes[i + 1] === 97 &&  // 'a'
          bytes[i + 2] === 116 && // 't'
          bytes[i + 3] === 97     // 'a'
        ) {
          // Read data chunk size (next 4 bytes, little-endian)
          dataSize = dataView.getUint32(i + 4, true);
          dataStart = i + 8;
          console.log('Found data chunk at:', dataStart, 'size:', dataSize);
          break;
        }
      }

      if (dataStart === -1) {
        throw new Error('Could not find data chunk in WAV file');
      }

      // Extract PCM samples (16-bit, little-endian)
      const sampleCount = Math.floor(dataSize / 2); // 16-bit = 2 bytes per sample
      const samples = new Int16Array(bytes.buffer, dataStart, sampleCount);
      
      console.log('Extracted samples:', sampleCount);

      // Convert to MP3 using lamejs
      // Parameters: channels (1=mono, 2=stereo), sample rate, bitrate
      const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
      const mp3Data: Uint8Array[] = [];
      
      const sampleBlockSize = 1152; // Standard MP3 frame size
      
      for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(new Uint8Array(mp3buf));
        }
      }

      // Flush remaining data
      const mp3buf = mp3Encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }

      console.log('MP3 encoding complete, chunks:', mp3Data.length);

      // Combine all MP3 chunks
      let totalLength = 0;
      mp3Data.forEach((chunk) => {
        totalLength += chunk.length;
      });

      console.log('Total MP3 size:', totalLength, 'bytes');

      const mp3Buffer = new Uint8Array(totalLength);
      let offset = 0;
      mp3Data.forEach((chunk) => {
        mp3Buffer.set(chunk, offset);
        offset += chunk.length;
      });

      // Convert to base64
      let mp3Binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < mp3Buffer.length; i += chunkSize) {
        const chunk = mp3Buffer.subarray(i, Math.min(i + chunkSize, mp3Buffer.length));
        mp3Binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      const mp3Base64 = btoa(mp3Binary);

      // Write to file system
      const mp3Uri = FileSystem.cacheDirectory + 'recording_' + Date.now() + '.mp3';
      await FileSystem.writeAsStringAsync(mp3Uri, mp3Base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('MP3 file saved to:', mp3Uri);
      return mp3Uri;
    } catch (error: any) {
      console.error('MP3 conversion error:', error);
      console.error('Error details:', error.message, error.stack);
      throw new Error('Failed to convert audio to MP3 format: ' + error.message);
    }
  };

  const processVoiceRecording = async () => {
    if (!recordedUri) {
      alert('No recording found');
      return;
    }

    let mp3Uri: string | null = null;

    try {
      onLoadingChange(true);

      // Try to convert audio to MP3
      console.log('Converting audio to MP3...');
      try {
        mp3Uri = await convertAudioToMp3(recordedUri);
        console.log('MP3 conversion successful:', mp3Uri);
      } catch (conversionError: any) {
        console.warn('MP3 conversion failed:', conversionError.message);
        
        // Check file extension
        const fileExt = recordedUri.split('.').pop()?.toLowerCase();
        console.log('Original file extension:', fileExt);
        
        // If conversion was skipped (M4A format), send as MP3 anyway
        // Backend might accept it or we need server-side conversion
        if (conversionError.message === 'SKIP_CONVERSION' || fileExt === 'm4a' || fileExt === 'mp4' || fileExt === 'aac') {
          console.log('Sending M4A as audio file - backend may need to handle conversion');
          mp3Uri = recordedUri;
        }
        // If it's already a supported format by Uplift AI, use it directly
        else if (fileExt === 'wav' || fileExt === 'webm' || fileExt === 'ogg' || fileExt === 'mp3') {
          mp3Uri = recordedUri;
          console.log('Using original supported format:', mp3Uri);
        } else {
          throw new Error('Audio format not supported. Please try again or contact support.');
        }
      }

      const form = new FormData();
      const fileExt = mp3Uri.split('.').pop()?.toLowerCase();
      
      let name = 'recording.mp3';
      let mime = 'audio/mpeg';
      
      // Set correct MIME type based on file extension
      if (fileExt === 'wav') {
        name = 'recording.wav';
        mime = 'audio/wav';
      } else if (fileExt === 'webm') {
        name = 'recording.webm';
        mime = 'audio/webm';
      } else if (fileExt === 'ogg') {
        name = 'recording.ogg';
        mime = 'audio/ogg';
      } else if (fileExt === 'm4a' || fileExt === 'mp4' || fileExt === 'aac') {
        // Send M4A as WAV - some systems accept it
        name = 'recording.wav';
        mime = 'audio/wav';
        console.warn('Sending M4A as WAV format - may not work with strict validators');
      }

      console.log('Uploading:', name, 'MIME:', mime, 'Original ext:', fileExt);

      // @ts-ignore
      form.append('file', { uri: mp3Uri, name, type: mime });

      const result = await processVoice(form as any).unwrap();

      if (result?.success && result?.data) {
        onVoiceComplete(result.data);
        clearRecording();
        
        // Clean up temporary MP3 file (only if we created one)
        if (mp3Uri !== recordedUri) {
          try {
            await FileSystem.deleteAsync(mp3Uri, { idempotent: true });
          } catch (cleanupError) {
            console.warn('Failed to cleanup temp file:', cleanupError);
          }
        }
      } else {
        throw new Error(result?.data?.error || 'Failed to process voice');
      }
    } catch (error: any) {
      console.error('Process voice error:', error);
      alert(error?.message || 'Failed to process voice recording. Please try again.');
    } finally {
      onLoadingChange(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voice Recording</Text>

      <View style={styles.recordBox}>
        {/* Start Recording Button */}
        {!isRecording && !recordedUri && !loadingChange && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={startRecording}
            activeOpacity={0.7}
          >
            <Mic size={16} color={themeColors.foreground} />
            <Text style={styles.startButtonText}>Start Recording</Text>
          </TouchableOpacity>
        )}

        {/* Recording State */}
        {isRecording && (
          <View style={styles.recordingState}>
            <View style={styles.recordingIndicator}>
              <Animated.View 
                style={[
                  styles.redDot,
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Text style={styles.recordingText}>Recording...</Text>
              <Text style={styles.recordingDuration}>
                {formatDuration(recordingDuration)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
              activeOpacity={0.8}
            >
              <Square size={16} color="#fff" fill="#fff" />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Preview Controls */}
        {recordedUri && !loadingChange && (
          <View style={styles.previewContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={isPlaying ? pauseAudio : playAudio}
                activeOpacity={0.7}
              >
                {isPlaying ? (
                  <Pause size={16} color={themeColors.foreground} />
                ) : (
                  <Play size={16} color={themeColors.foreground} />
                )}
                <Text style={styles.playButtonText}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.durationText}>
                {formatDuration(recordingDuration)}
              </Text>

              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearRecording}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.processButton}
              onPress={processVoiceRecording}
              activeOpacity={0.8}
            >
              <Text style={styles.processButtonText}>Process Recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State with Progress */}
        {loadingChange && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={themeColors.primary} />
            <Text style={styles.loadingText}>Processing voice recording...</Text>
          </View>
        )}
      </View>

      <Text style={styles.helpText}>
        Tip: Speak clearly about your transaction. Example: "I spent ₨15.50 at Starbucks for coffee today using my credit card"
      </Text>
    </View>
  );
};

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: theme.foreground,
      marginBottom: spacing.sm,
    },
    recordBox: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.sm,
    },
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      ...shadows.sm,
    },
    startButtonText: {
      color: theme.foreground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    recordingState: {
      gap: spacing.md,
    },
    recordingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    redDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#ef4444',
    },
    recordingText: {
      color: theme.foreground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    recordingDuration: {
      color: theme.mutedForeground,
      fontSize: fontSize.sm,
    },
    stopButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: theme.destructive,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      ...shadows.sm,
    },
    stopButtonText: {
      color: '#ffffff',
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    previewContainer: {
      gap: spacing.md,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      ...shadows.sm,
    },
    playButtonText: {
      color: theme.foreground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    clearButton: {
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    clearButtonText: {
      color: theme.mutedForeground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    durationText: {
      color: theme.mutedForeground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    processButton: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    processButtonText: {
      color: theme.primaryForeground,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.md,
    },
    loadingText: {
      color: theme.mutedForeground,
      fontSize: fontSize.sm,
    },
    helpText: {
      fontSize: fontSize.xs,
      color: theme.mutedForeground,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
  });

export default VoiceRecorder;
