import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, any>;

export default function SignInScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to Smart Money</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <Button title="Sign In" onPress={() => navigation.replace('Main')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 12, borderRadius: 6 },
});
