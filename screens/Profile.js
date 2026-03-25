import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/date_formatter";

function Profile() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No user data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name?.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>{formatDate(user.created_at)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Updated</Text>
          <Text style={styles.value}>{formatDate(user.updated_at)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
  },

  /* Avatar */
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  /* Divider */
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 20,
  },

  /* Card */
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  row: {
    marginBottom: 12,
    justifyContent: "center",
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },

  empty: {
    fontSize: 16,
    color: "#6b7280",
  },
});

export default Profile;
