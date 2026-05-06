import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackNavigationBtn() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          router.replace("/(tabs)/feed");
        }
      }}
    >
      <Feather name="chevron-left" size={24} />
    </TouchableOpacity>
  );
}