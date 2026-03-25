import Toast from "react-native-toast-message";

// For use in login and register pages
export const authToast = ({ type, text1, text2, setDisabled }) => {
  setDisabled(true);

  Toast.show({
    type,
    text1,
    ...(text2 && { text2 }),
    position: "top",
    topOffset: 120,
    onHide: () => setDisabled(false),
  });
};

// For use in logout
export const logoutToast = ({ type, text1, text2 }) => {
  Toast.show({
    type,
    text1,
    ...(text2 && { text2 }),
    position: "top",
    topOffset: 120,
  });
};
