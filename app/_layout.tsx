import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
              name="index"
              options={{
                headerBackVisible: false,
                headerLeft: () => null,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
        name="UploadProblem"
        options={{ headerShown: true, title: "Upload Problem" }}
      />
    </Stack>
  );
}