import { Stack } from "expo-router";
import AuthProvider from "./hooks/AuthContext";


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack> 
        <Stack.Screen
          name="(tabs)" 
          options={{ headerShown: false,}} 
        />
        <Stack.Screen
          name="(auth)"
          options={{
            presentation: 'modal',
            headerShown: false
          }} 
        />
      </Stack>
    </AuthProvider>
  )
}
