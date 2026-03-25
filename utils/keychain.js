import * as Keychain from "react-native-keychain";

const SERVICE = "auth_token";

// Save user token
export const saveToken = async (token) => {
  try {
    await Keychain.setGenericPassword("token", token, {
      service: SERVICE,
    });

    console.log("Token saved successfully");
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

// Retrieve user token
export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE,
    });

    // If token exists
    if (credentials) {
      const token = credentials.password;
      return token;
    }

    // If no token found
    return null;
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

// Delete user token
export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword({
      service: SERVICE,
    });

    console.log("Token deleted successfully");
  } catch (error) {
    console.log("Error deleting token:", error);
  }
};
