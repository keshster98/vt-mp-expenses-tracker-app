import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// List all places
export const listPlaces = async (token) => {
  try {
    const response = await axios.get(API_URL + "/places", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error listing places: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};

// Get a specific place by ID
export const getPlace = async (id, token) => {
  try {
    const response = await axios.get(API_URL + "/places/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error getting place: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};

// Create a place
export const createPlace = async (data, token) => {
  try {
    const response = await axios.post(API_URL + "/places", data, {
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

// Delete a place
export const deletePlace = async (id, token) => {
  try {
    const response = await axios.delete(API_URL + "/places/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return response.data;
  } catch (error) {
    Toast.show({
      type: "error",
      text1: `Error deleting place: ${error.response.data.message}`,
      position: "top",
      topOffset: 105,
    });
  }
};
