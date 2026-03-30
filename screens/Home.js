import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { useState, useLayoutEffect, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  createExpense,
  listExpenses,
  updateExpense,
  deleteExpense,
} from "../utils/api_expenses";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { FlatList } from "react-native";

function Home({ navigation }) {
  const token = useSelector((state) => state.auth.token);

  // List of expenses
  const [expenses, setExpenses] = useState([]);

  // Add/Update modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Store ID of expense to be updated/deleted
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  // Add Expense (Fields)
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const categories = ["Food", "Transport", "Bills", "Lifestyle", "Others"];
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");

  // Header button (+)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      ),
    });
  }, [navigation]);

  // Fetch expenses on first render
  useEffect(() => {
    const fetchData = async () => {
      const data = await listExpenses(token);

      if (data) {
        setExpenses(data.data);
      }
    };

    fetchData();
  }, []);

  // Add expense
  const addExpenseHandler = async () => {
    const data = {
      title,
      amount: parseFloat(amount),
      category,
      date: date.format("YYYY-MM-DD"),
      description,
      attachment: null,
    };

    const newExpense = await createExpense(data, token);

    // Prevent the function from further executing if API call fails for adding expense (error handled by backend)
    if (!newExpense) {
      return;
    }

    // Update locally (prevent maxing out API usage)
    const fixedExpense = {
      ...newExpense.expense,
      category: data.category,
    };

    setExpenses((prev) => [fixedExpense, ...prev]);

    // Reset add expense form
    setTitle("");
    setAmount("");
    // Set default category option to first option in the array
    setCategory("Food");
    // Set default date to current date
    setDate(dayjs());
    setDescription("");
    setModalVisible(false);
  };

  const updateExpenseHandler = async () => {
    const data = {
      title,
      amount: parseFloat(amount),
      category,
      date: date.format("YYYY-MM-DD"),
      description,
      attachment: null,
    };

    const updatedExpense = await updateExpense(selectedExpenseId, data, token);

    if (!updatedExpense) {
      return;
    }

    const fixedExpense = {
      ...updatedExpense.expense,
      category: data.category,
    };

    setExpenses((prev) =>
      prev.map((item) => (item.id === selectedExpenseId ? fixedExpense : item)),
    );

    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(dayjs());
    setDescription("");
    setSelectedExpenseId(null);
    setIsEditing(false);
    setModalVisible(false);
  };

  // Delete expense
  const deleteExpenseHandler = async () => {
    const delExpense = await deleteExpense(selectedExpenseId, token);

    if (!delExpense) {
      return;
    }

    // Instant update
    setExpenses((prev) => prev.filter((item) => item.id !== selectedExpenseId));

    setDeleteModalVisible(false);
    setSelectedExpenseId(null);
  };

  return (
    <View style={styles.container}>
      {/* Total Expenses */}
      <Text style={styles.total}>
        Total Expenses: RM
        {expenses
          .reduce((sum, item) => sum + Number(item.amount), 0)
          .toFixed(2)}
      </Text>

      {/* List of Expenses */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              setIsEditing(true);
              setSelectedExpenseId(item.id);

              setTitle(item.title);
              setAmount(item.amount.toString());
              setCategory(item.category || "Food");
              setDate(dayjs(item.date));
              setDescription(item.description || "");
              setModalVisible(true);
            }}
          >
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {dayjs(item.date).format("DD MMM YYYY")}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.amount}>
                RM {Number(item.amount).toFixed(2)}
              </Text>

              <Pressable
                onPress={() => {
                  setSelectedExpenseId(item.id);
                  setDeleteModalVisible(true);
                }}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="trash" size={20} color="red" />
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.addModal}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Expense" : "Add Expense"}
            </Text>

            {/* Title */}
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            {/* Amount */}
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            {/* Date Picker with dayjs */}
            <Text style={styles.label}>Date Picker</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.format("DD MMM YYYY")}</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={date.toDate()}
                mode="date"
                display="default"
                // Users are allowed to add data only up to the past year from the selected date
                minimumDate={dayjs().subtract(1, "year").toDate()}
                // Users are not allowed to select future dates, only past up till current date
                maximumDate={dayjs().toDate()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(dayjs(selectedDate));
                  }
                }}
              />
            )}

            {/* Description */}
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />

            {/* Modal Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setIsEditing(false);

                  setTitle("");
                  setAmount("");
                  setCategory("Food");
                  setDate(dayjs());
                  setDescription("");
                }}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.addBtn}
                onPress={isEditing ? updateExpenseHandler : addExpenseHandler}
              >
                <Text style={{ color: "white" }}>
                  {isEditing ? "Update" : "Add"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            {/* Modal Title */}
            <Text style={styles.modalTitle}>Delete Expense</Text>

            {/* Modal Context */}
            <Text>Are you sure you want to delete this expense?</Text>

            {/* Modal Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.deleteBtn}
                onPress={deleteExpenseHandler}
              >
                <Text style={{ color: "white" }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  total: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    color: "#ccc",
    fontSize: 12,
  },
  amount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelBtn: {
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },
  addBtn: {
    padding: 12,
    backgroundColor: "#6200ee",
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  addModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  deleteModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  deleteBtn: {
    padding: 12,
    backgroundColor: "red",
    borderRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
});

export default Home;
