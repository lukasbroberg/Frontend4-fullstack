import { router, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function TabsLayout() {

  const {user,token,isAuthenticated,isLoading,login,register,logout} = useAuth();

  const loginButtonHeader = () => {
    if(isAuthenticated){
        return(
            <Pressable onPress={logout}>
                <Text style={{color: 'black'}}>Logout</Text>
            </Pressable>
        )
    }
    return(
        <>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text style={{color: 'black'}}>Login</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
                <Text style={{color: 'black'}}>Register</Text>
            </Pressable>
        </>
    )
    
  }


    return ( // dynamic route "[ ]"
        <Tabs screenOptions={{
            headerShown: true,
            headerRight: loginButtonHeader,
        }}>
            <Tabs.Screen name="feed" options={{ title: "ProblemHub" }} />
            <Tabs.Screen name="chatPage" options={{ title: "Chat" }} />
        </Tabs>
    )
}


