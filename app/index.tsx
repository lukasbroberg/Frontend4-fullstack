import React from "react";
import { View } from "react-native";
import ChatScreen from './screens/chatPage.jsx';


export default function Index() {

  const _tmp_userId = 1;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <ChatScreen></ChatScreen>

    </View>
  );
}
