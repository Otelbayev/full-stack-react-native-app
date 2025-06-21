import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MainPage() {
  const router = useRouter();

  const getUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString !== null) {
        const user = JSON.parse(userString);
        console.log("User:", user);
        return user;
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Failed to parse user:", error);
      return null;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="bg-blue-100 w-full rounded-2xl p-6 shadow-md">
        <View className="items-center mb-4">
          <FontAwesome name="user-circle" size={80} color="#3B82F6" />
          <Text className="text-xl font-bold mt-3 text-gray-800">
            Raxmonov Laziz
          </Text>
          <Text className="text-lg text-gray-800 font-bold">Azamat o'g'li</Text>
        </View>

        <View className="mb-3 flex-row  items-center">
          <MaterialIcons name="school" size={28} color="#6B7280" />
          <Text className="ml-3 text-lg text-gray-800 font-medium">
            Toshkent davlat transport universiteti
          </Text>
        </View>

        <View className="mb-3 flex-row items-center">
          <MaterialIcons name="computer" size={28} color="#6B7280" />
          <Text className="ml-3 text-lg text-gray-800 font-medium">
            Transporta axborot tizimlari va texnologiyalari
          </Text>
        </View>

        <View className="mb-6 flex-row items-center">
          <MaterialIcons name="class" size={28} color="#6B7280" />
          <Text className="ml-3 text-lg text-gray-800 font-medium">AT-3</Text>
        </View>

        <TouchableOpacity
          onPress={logout}
          className="bg-red-500 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
