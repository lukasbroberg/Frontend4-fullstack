import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
// Nó sẽ đứng trước toàn bộ màn hình bên trong (app).Nên nếu chưa login, user sẽ bị chặn ngay.
// file nay dung de bao ve toan bo app
export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}