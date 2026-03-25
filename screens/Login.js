import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { login } from "../utils/api_auth";
import { GlobalStyles } from "../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { authToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/redux/auth_slice";
import { saveToken } from "../utils/keychain";
// import { validateEmail } from "../utils/email";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const loginHandler = async () => {
    const trimmedEmail = email.trim();

    /*
    // Removed as backend already has checks in place
    
    // Checks if all fields are filled up
    if (!trimmedEmail || !password) {
      authToast({
        type: "error",
        text1: "Please fill up all fields!",
        setDisabled,
      });
      return;
    }
    // Checks if the email entered is a valid email format
    if (!validateEmail(trimmedEmail)) {
      authToast({
        type: "error",
        text1: "Please use a valid email!",
        setDisabled,
      });
      return;
    }
    */

    const verifyUser = await login(trimmedEmail, password);

    if (verifyUser) {
      const token = verifyUser.access_token;
      const name = verifyUser.user.name;

      authToast({
        type: "success",
        text1: `Welcome, ${name}!`,
        setDisabled,
      });

      // Save in Keychain
      await saveToken(token);

      // Save in Redux
      dispatch(setToken(token));
      dispatch(setUser(verifyUser.user));

      navigation.replace("Main");
    }

    /*
    // Removed as backend already has checks in place

    else {
      authToast({
        type: "error",
        text1: "Invalid email or password!",
        text2: "Please try again.",
        setDisabled,
      });
    }
    */
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Login to your Account</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.inputPassword]}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          {/* Reveal Password Button */}
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </Pressable>
        </View>
      </View>

      {/* Login Button  */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={loginHandler}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      {/* Link to Register Page  */}
      <Pressable onPress={() => navigation.replace("Register")}>
        <Text style={styles.loginText}>Don't have an account? Register </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputPassword: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 16,
    textAlign: "center",
    color: "#3b82f6",
    fontSize: 14,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default Login;
