import { Stack } from "expo-router";


export default function RootLayout() {
  
  
  return (
    // åben
    <Stack> 
      <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
    </Stack> // luk
  )
}
