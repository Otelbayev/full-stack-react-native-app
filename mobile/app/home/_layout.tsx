import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="main"
        options={{
          title: "Main",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wagons"
        options={{
          title: "Wagons",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="train-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stations"
        options={{
          title: "Stations",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: "Routes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bus-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trains"
        options={{
          title: "Trains",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="subway-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
