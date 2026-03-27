import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// List all user expenses
export const listExpenses = async (token) => {
  try {
    const response = await axios.get(API_URL + "/expenses", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error listing expenses: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};

// Get a user expense
export const getExpense = async (id, token) => {
  try {
    const response = await axios.get(API_URL + "/expenses/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error getting expense: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};

// Create an expense
export const createExpense = async (data, token) => {
  try {
    const response = await axios.post(API_URL + "/expenses", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    let message = "Failed to create expense";

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
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

// Update an expense
export const updateExpense = async (id, data, token) => {
  try {
    const response = await axios.put(API_URL + "/expenses/" + id, data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error updating expense: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};

// Deleting an expense
export const deleteExpense = async (id, token) => {
  try {
    const response = await axios.delete(API_URL + "/expenses/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error deleting expense: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};
