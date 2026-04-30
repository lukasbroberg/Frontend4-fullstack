import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackNavigationBtn(){
    const router = useRouter();

    return(
        <>
            <TouchableOpacity onPress={() => router.back()}>
                <Feather name="chevron-left" size={24}/>
            </TouchableOpacity>
        </>
    )
}