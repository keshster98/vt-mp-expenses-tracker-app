import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
});

export default Loading;
