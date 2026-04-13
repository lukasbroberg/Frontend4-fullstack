import { Feather } from "@expo/vector-icons";
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
            <Tabs.Screen
                name="feed"
                options={{
                    title: "ProblemHub",
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name="home"
                            color={color}
                            size={16}>    
                        </Feather>
                
                    )
                 }}
            />
            <Tabs.Screen
                name="UploadProblem"
                options={{
                    title: "Create new",
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name="plus-circle"
                            color={color}
                            size={16}>
                        </Feather>
                
                    )
                }} 
            />

            <Tabs.Screen
                name="MyProblems"
                options={{
                    title: "My problems",
                    tabBarIcon: ({color, focused}) => (
                        <Feather
                            name="user"
                            color={color}
                            size={16}>
                        </Feather>
                
                    )
                }} 
            />
        </Tabs>
    )
}


