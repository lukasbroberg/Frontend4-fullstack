import { Text, View } from "react-native";
import { useAuth } from "../hooks/AuthContext";

export default function MyProblems(){

    const {isAuthenticated, user, token} = useAuth();

    return(
        <View>
            <Text>My problems</Text>
        </View>
    )
}