import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Register
export const register = async (
  name,
  email,
  password,
  password_confirmation,
) => {
  try {
    const response = await axios.post(API_URL + "/register", {
      name: name,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    });
    return response.data;
  } catch (error) {
    let message = "Something went wrong";

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      // Get the first error in the list
      const firstKey = Object.keys(errors)[0];
      message = errors[firstKey][0];
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      topOffset: 105,
    });
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "/login", {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    let message = "Something went wrong";

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      // Get the first error in the list
      const firstKey = Object.keys(errors)[0];
      message = errors[firstKey][0];
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      topOffset: 105,
    });
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(API_URL + "/user", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Getting user error:", error.reponse.data.message);
    return null;
  }
};

// Logout
export const logout = async (token) => {
  try {
    const response = await axios.post(
      API_URL + "/logout",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );
    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: error.response.data.message,
      position: "top",
      topOffset: 105,
    });
  }
};
