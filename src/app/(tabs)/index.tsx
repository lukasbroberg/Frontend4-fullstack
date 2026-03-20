import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";



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

      <Link href={{
        pathname:'/chatPage',
          params: {id: '1'}

        }}> Første chat wup </Link>

      <Link href={{
        pathname:'/chatPage',
          params: {id: '2'}

        }}> Anden chat wup </Link>

     
    </View>
  );
}
