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
    console.log(`[Expo Secure Store] Got user token: ${token}`);
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

// Save user data
export const saveUser = async (user) => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    console.log("[Expo Secure Store] Saved user data");
  } catch (error) {
    console.log("[Expo Secure Store] Error saving user data:", error);
  }
};

// Get user data
export const getUser = async () => {
  try {
    const user = await SecureStore.getItemAsync(USER_KEY);
    if (user) {
      console.log("[Expo Secure Store] Got user data");
    } else {
      console.log("[Expo Secure Store] Got user data: null");
    }
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log("[Expo Secure Store] Error getting user data:", error);
    return null;
  }
};

// Delete user data (not user account)
export const deleteUser = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
    console.log("[Expo Secure Store] Deleted user data");
  } catch (error) {
    console.log("[Expo Secure Store] Error deleting user data:", error);
  }
};
