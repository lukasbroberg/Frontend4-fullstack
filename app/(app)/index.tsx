import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={{ backgroundColor: "#2563eb", padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: "white" }}>Hjem</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{ backgroundColor: "#16a34a", padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: "white" }}>Log ind</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ backgroundColor: "#f59e0b", padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: "white" }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}