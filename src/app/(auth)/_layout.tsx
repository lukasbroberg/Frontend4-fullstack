import { Stack } from "expo-router";
import BackNavigationBtn from "../components/BackNavigationBtn";

export default function AuthLayout(){
    return(
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: 'Authentication',
            headerLeft: BackNavigationBtn,
        }}>
            <Stack.Screen name="login"></Stack.Screen>
            <Stack.Screen name="register"></Stack.Screen>
        </Stack>
    )
}