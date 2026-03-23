import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <Text style={{fontSize:28,fontWeight:"bold"}}>Hjem</Text>

      <Text style={{marginTop:10}}>
        Hej {user?.username}
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop:20,
          backgroundColor:"#2563eb",
          padding:14,
          borderRadius:10
        }}
      >
        <Text style={{color:"#fff"}}>Log ud</Text>
      </TouchableOpacity>
    </View>
  );
}