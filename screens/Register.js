import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { register } from "../utils/api_auth";
import { GlobalStyles } from "../constants/styles";
import { authToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/redux/auth_slice";
import { saveToken, saveUser } from "../store/expo/expo_secure_store";
// import { validateEmail } from "../utils/email";

function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const registerHandler = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    /*
    // Remove as backend already has checks in place

    // Checks if all fields are filled up
    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
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
    // Checks if the password and confirm password matches
    if (trimmedPassword !== trimmedConfirmPassword) {
      authToast({
        type: "error",
        text1: "The passwords do not match!",
        text2: "Try again.",
        setDisabled,
      });
      return;
    }
    */

    const registerUser = await register(
      trimmedName,
      trimmedEmail,
      password,
      confirmPassword,
    );

    if (registerUser) {
      const token = registerUser.access_token;
      const name = registerUser.user.name;

      authToast({
        type: "success",
        text1: `Successfully registered, ${name}!`,
        text2: "Logging you in.",
        setDisabled,
      });

      // Save in Keychain
      await saveToken(token);
      await saveUser(registerUser.user);

      // Save in Redux
      dispatch(setToken(token));
      dispatch(setUser(registerUser.user));
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Register for an Account</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

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

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.inputPassword]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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

      {/* Register Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={registerHandler}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      {/* Link to Login */}
      <Pressable onPress={() => navigation.replace("Login")}>
        <Text style={styles.loginText}>Already have an account? Login </Text>
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
  buttonDisabled: {
    backgroundColor: "#ccc",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default Register;
