import { StatusBar } from "expo-status-bar";
import Navigation from "./navigation/Navigation";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <Navigation />
      </Provider>
      <Toast />
    </>
  );
}
