import { View, Text, StyleSheet } from "react-native";

function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default Home;
