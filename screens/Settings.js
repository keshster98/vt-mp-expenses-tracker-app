import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clearToken } from "../store/redux/auth_slice";
import { deleteToken } from "../utils/keychain";
import { logoutToast } from "../utils/toast";

function Settings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const name = user?.name || "User";

  const logoutHandler = async () => {
    logoutToast({
      type: "success",
      text1: `Goodbye, ${name}!`,
    });

    // Remove from Keychain
    await deleteToken();
    // Remove from Redux
    dispatch(clearToken());
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsMenu}>
        <Pressable
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          onPress={logoutHandler}
        >
          <Text style={styles.tileText}>Log Out</Text>

          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  settingsMenu: {
    marginTop: 20,
  },
  tile: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  tileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default Settings;
