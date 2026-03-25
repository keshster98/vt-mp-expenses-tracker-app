import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Save user token
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log(`[Expo Secure Store] User token saved: ${token}`);
  } catch (error) {
    console.log("[Expo Secure Store] Error saving user token:", error);
  }
};

// Retrieve user token
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
      console.log(`[Expo Secure Store] Got user token: ${token}`);
    } else {
      console.log(`[Expo Secure Store] Got user token: null`);
    }

    return token;
  } catch (error) {
    console.log("[Expo Secure Store] Error getting user token:", error);
    return null;
  }
};

// Delete user token
export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log("[Expo Secure Store] Deleted user token");
  } catch (error) {
    console.log("[Expo Secure Store] Error deleting user token:", error);
  }
};
