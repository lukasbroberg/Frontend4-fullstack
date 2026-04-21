import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
  if (!username.trim() || !password.trim()) {
    Alert.alert("Fejl", "Udfyld brugernavn og adgangskode");
    return;
  }

  try {
    setIsSubmitting(true);
    console.log("STEP 1: before login");

    const result = await login({
      username: username.trim(),
      password: password.trim(),
    });

    console.log("STEP 2: login success", result);
    console.log("STEP 3: before router.replace");

    router.replace("/feed" as any);

    console.log("STEP 4: after router.replace");
  } catch (error: any) {
    console.log(
      "LOGIN SCREEN ERROR:",
      error?.response?.data || error?.message || error
    );

    const message =
      typeof error?.response?.data === "string"
        ? error.response.data
        : error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Login mislykkedes";

    Alert.alert("Login mislykkedes", message);
  } finally {
    setIsSubmitting(false);
  }
};

  /*const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Fejl", "Udfyld brugernavn og adgangskode");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await login({
        username: username.trim(),
        password: password.trim(),
      });

      console.log("LOGIN SCREEN OK:", result);

      router.replace("/feed" as any);
    } catch (error: any) {
      console.log(
        "LOGIN SCREEN ERROR:",
        error?.response?.data || error?.message || error
      );

      const message =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Login mislykkedes";

      Alert.alert("Login mislykkedes", message);
    } finally {
      setIsSubmitting(false);
    }
  };*/

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log ind</Text>
      <Text style={styles.subtitle}>Velkommen tilbage, vi har savnet dine ideer.</Text>

      <Text style={styles.label}>Brugernavn</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Indtast brugernavn eller email"
        autoCapitalize="none"
        placeholderTextColor="#7c8798"
        style={styles.input}
      />

      <Text style={styles.label}>Adgangskode</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Indtast adgangskode"
        placeholderTextColor="#7c8798"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isSubmitting}
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log ind</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryCta} onPress={() => router.replace("/register" as any)}> 
        <Text style={styles.secondaryCtaText}>Ny her? Opret en konto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 28,
  },
  label: {
    marginBottom: 8,
    fontWeight: "700",
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#0f172a",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryCta: {
    alignItems: "center",
    marginTop: 18,
  },
  secondaryCtaText: {
    color: "#1d4ed8",
    fontWeight: "700",
  },
});