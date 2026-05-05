import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTypedSelector, useAppDispatch } from '../../store/hooks';
import { updateUser as updateUserStore, logout } from '../../features/auth/authSlice';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { useUpdateUserMutation } from '../../features/user/userAPI';

export default function AccountScreen() {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profilePicture || null);
  const [picked, setPicked] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [updateUser] = useUpdateUserMutation();

  const handleChooseFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
    if (res.canceled || !res.assets?.length) return;
    const asset = res.assets[0];
    const uri = asset.uri;
    const name = asset.fileName || 'avatar.jpg';
    const type = asset.mimeType || 'image/jpeg';
    setPicked({ uri, name, type });
    setAvatarPreview(uri);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const form = new FormData();
      form.append('name', name);
      if (picked) {
        // @ts-ignore - React Native FormData file
        form.append('profilePicture', { uri: picked.uri, name: picked.name, type: picked.type });
      }
      const resp = await updateUser(form as any).unwrap();
      const updated = (resp as any)?.data?.user || (resp as any)?.data || (resp as any); // be tolerant to response shape
      if (updated) {
        const profileUrl = (updated as any).profilePicture || (updated as any).avatar || null;
        dispatch(updateUserStore({ name: updated.name, profilePicture: profileUrl || undefined }));
        setName(updated.name || name);
        setAvatarPreview(profileUrl || avatarPreview);
      }
      Alert.alert('Saved', 'Account updated successfully');
    } catch (e) {
      Alert.alert('Update failed', 'Could not update your account');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => dispatch(logout());

  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Settings</Text>
        <Text style={styles.navbarSubtitle}>Manage your account settings and set e-mail preferences.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.cardSubtitle}>Update your account settings.</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Profile Picture</Text>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              {avatarPreview ? (
                <Image source={{ uri: avatarPreview }} style={styles.avatarImage} />
              ) : (
                <User size={32} color={themeColors.mutedForeground} />
              )}
            </View>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <TouchableOpacity 
                onPress={handleChooseFile} 
                style={[styles.chooseBtn, { borderColor: themeColors.border }]}
              >
                <Text style={{ color: themeColors.foreground, fontSize: fontSize.sm }}>
                  Choose File
                </Text>
              </TouchableOpacity>
              <Text style={styles.recommend}>
                Recommended: Square JPG, PNG, at least 300x300px.
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.card, color: themeColors.foreground }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={themeColors.mutedForeground}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={themeColors.primaryForeground} />
            ) : (
              <Text style={[styles.buttonText, { color: themeColors.primaryForeground }]}>Update account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.logoutButton, { backgroundColor: themeColors.destructive }]} onPress={handleLogout}>
            <Text style={[styles.logoutButtonText, { color: themeColors.destructiveForeground }]}>Logout</Text>
          </TouchableOpacity>
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
      backgroundColor: theme.background 
    },
    navbar: { 
      backgroundColor: theme.navbar, 
      padding: spacing.lg, 
      paddingTop: spacing.xl + 20 
    },
    navbarTitle: { 
      fontSize: fontSize['2xl'], 
      fontWeight: fontWeight.bold, 
      color: theme.navbarForeground 
    },
    navbarSubtitle: { 
      fontSize: fontSize.sm, 
      color: theme.navbarForeground, 
      opacity: 0.9, 
      marginTop: spacing.xs 
    },
    content: { 
      padding: spacing.lg 
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
    cardTitle: { 
      fontSize: fontSize.lg, 
      fontWeight: fontWeight.semibold, 
      color: theme.foreground 
    },
    cardSubtitle: { 
      fontSize: fontSize.sm, 
      color: theme.mutedForeground, 
      marginTop: spacing.xs 
    },
    divider: { 
      height: 1, 
      backgroundColor: theme.border, 
      marginVertical: spacing.lg 
    },
    label: { 
      fontSize: fontSize.sm, 
      fontWeight: fontWeight.medium, 
      color: theme.foreground, 
      marginBottom: spacing.sm 
    },
    inputGroup: { 
      marginTop: spacing.lg 
    },
    input: {
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      backgroundColor: theme.background,
    },
    avatarRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: spacing.md, 
      marginBottom: spacing.sm 
    },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.muted,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: { 
      width: 80, 
      height: 80,
      resizeMode: 'cover',
    },
    chooseBtn: { 
      borderWidth: 1, 
      borderRadius: borderRadius.md, 
      paddingHorizontal: spacing.md, 
      paddingVertical: spacing.sm,
      backgroundColor: theme.background,
    },
    fileHelp: { 
      fontSize: fontSize.xs,
      color: theme.mutedForeground,
    },
    recommend: { 
      fontSize: fontSize.xs, 
      marginTop: spacing.sm,
      color: theme.mutedForeground,
    },
    button: { 
      padding: spacing.md, 
      borderRadius: borderRadius.md, 
      alignItems: 'center', 
      marginTop: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: { 
      fontSize: fontSize.md, 
      fontWeight: fontWeight.semibold 
    },
    logoutButton: { 
      marginTop: spacing.md 
    },
    logoutButtonText: { 
      fontSize: fontSize.md, 
      fontWeight: fontWeight.semibold 
    },
  });
