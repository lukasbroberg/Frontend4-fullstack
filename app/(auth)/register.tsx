import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const { register, login } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Fejl", "Udfyld alle felter");
      return;
    }

    try {
      setLoading(true);

      await register({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      await login({
        username: username.trim(),
        password: password.trim(),
      });

      Alert.alert("Succes", "Konto oprettet");

      router.replace("/(tabs)/feed");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Kunne ikke oprette konto";

      Alert.alert("Fejl", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Opret konto</Text>
        <Text style={styles.subtitle}>Byg din profil og del dine bedste problem-loesninger.</Text>

        <Text style={styles.label}>Brugernavn</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Vaelg et brugernavn"
          placeholderTextColor="#7c8798"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          blurOnSubmit={false}
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          value={email}
          onChangeText={setEmail}
          placeholder="din@email.dk"
          placeholderTextColor="#7c8798"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          style={styles.input}
        />

        <Text style={styles.label}>Adgangskode</Text>
        <TextInput
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Vaelg en sikker kode"
          placeholderTextColor="#7c8798"
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Opret konto</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryCta} onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.secondaryCtaText}>Har du allerede en konto? Log ind</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flexGrow: 1,
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
