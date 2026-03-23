import { Stack } from "expo-router";


export default function RootLayout() {
  
  
  return (
    //Add AuthProvider here
    // åben
    <Stack> 
      <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
    </Stack> // luk
  )
}
