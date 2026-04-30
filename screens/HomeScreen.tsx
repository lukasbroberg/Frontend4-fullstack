import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { authService } from "../../../services/authService";
import { storageService } from "../../../services/storageService";
import { userService } from "../../../services/userService";

export default function HomeScreen() {
  

  const testRegister = async () => {
    console.log("begynder REGISTER");

    try {
      const result = await authService.register({
        username: "mari_new_3",
        email: "mari_new_3@gmail.com",
        password: "123456",
      });

      console.log("REGISTER OK:", result);
      alert("Register successful");
    } catch (error: any) {
      console.log("REGISTER ERROR FULL:", error);
      console.log("REGISTER ERROR MESSAGE:", error?.message);
      console.log("REGISTER ERROR RESPONSE:", error?.response?.data);
      alert(
        typeof error?.response?.data === "string"
          ? error.response.data
          : JSON.stringify(
              error?.response?.data || error?.message || "Register that bai"
            )
      );
    }
  };

  const testLogin = async () => {
    try {
      const result = await authService.login({
        username: "mari_new_3",
        password: "123456",
      });

      console.log("LOGIN OK:", result);
      alert("Login successful");
    } catch (error: any) {
      console.log(
        "LOGIN ERROR:",
        error?.response?.data || error?.message || error
      );
      alert("Login failed");
    }
  };

  const testGetToken = async () => {
    try {
      const token = await storageService.getToken();
      console.log("TOKEN Gemt:", token);
      alert(token ? "har token" : "ikke har token");
    } catch (error) {
      console.log("GET TOKEN ERROR:", error);
    }
  };

  const testGetMe = async () => {
    try {
      const result = await userService.getMe();
      console.log("GET ME OK:", result);
      alert(`Hello ${result.username}`);
    } catch (error: any) {
      console.log(
        "GET ME ERROR:",
        error?.response?.data || error?.message || error
      );
      alert("tage /auth/me failed");
    }
  };

  const testRawConnection = async () => {
    try {
      console.log("TEST RAW CONNECTION...");

      const response = await fetch("http://10.24.73.206:8080/auth/me");

      console.log("RAW STATUS:", response.status);

      const text = await response.text();
      console.log("RAW BODY:", text);

      alert(`Status: ${response.status}`);
    } catch (error: any) {
      console.log("RAW FETCH ERROR:", error);
      alert(`Fetch error: ${error?.message || error}`);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Test authService</Text>

      <TouchableOpacity
        onPress={testRegister}
        style={{
          backgroundColor: "green",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginBottom: 15,
          width: 220,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testLogin}
        style={{
          backgroundColor: "blue",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: 220,
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Test Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testGetToken}
        style={{
          backgroundColor: "orange",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: 220,
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Get Token
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testGetMe}
        style={{
          backgroundColor: "purple",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: 220,
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Get Me
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testRawConnection}
        style={{
          backgroundColor: "red",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: 220,
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Test Raw Connection
        </Text>
      </TouchableOpacity>
    </View>
  );
}
