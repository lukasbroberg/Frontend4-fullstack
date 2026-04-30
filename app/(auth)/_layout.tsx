import { Stack } from "expo-router";
import BackNavigationBtn from "../../components/BackNavigationBtn";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Authentication",
        headerLeft: () => <BackNavigationBtn />,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
/*import { Stack } from "expo-router";
import BackNavigationBtn from "../../components/BackNavigationBtn";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Authentication",
        headerLeft: () => <BackNavigationBtn />,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}*/