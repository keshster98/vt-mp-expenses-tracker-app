import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { GlobalStyles } from "../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const BottomTabs = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabsOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerTitle: "Expense Tracker App",
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        headerTitleAlign: "center",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function Navigation() {
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: "Expense Tracker App",
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerMode: "float",
        }}
      >
        {!token ? (
          <>
            {/* Auth Screens */}
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ animation: "slide_from_left" }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ animation: "slide_from_right" }}
            />
          </>
        ) : (
          <>
            {/* Main App */}
            <Stack.Screen
              name="Main"
              component={BottomTabsOverview}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
