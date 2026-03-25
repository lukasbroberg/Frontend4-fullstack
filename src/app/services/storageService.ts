import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

export const storageService = {
  async saveToken(token: string) {
    //For debuggin purpose we include localstorage for web
    if(Platform.OS == "web"){
      return localStorage.setItem(TOKEN_KEY, token)
    }
    return await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken() {
    //For debuggin purpose we include localstorage for web
    if(Platform.OS == "web"){
      return localStorage.getItem(TOKEN_KEY)
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken() {
    //For debuggin purpose we include localstorage for web
    if(Platform.OS == "web"){
      return localStorage.removeItem(TOKEN_KEY)
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};