import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

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

      const result = await login({
        username: username.trim(),
        password: password.trim(),
      });

      console.log("LOGIN SCREEN OK:", result);

      router.replace("/(app)");
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Log ind
      </Text>

      <Text style={{ marginBottom: 8, fontWeight: "600" }}>Brugernavn</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Indtast brugernavn eller email"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 8, fontWeight: "600" }}>Adgangskode</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Indtast adgangskode"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? "#999" : "#2563eb",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Log ind
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}