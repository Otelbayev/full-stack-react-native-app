import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const backgroundImage = require("../assets/images/bg.jpg");
const logo = require("../assets/images/logo.png");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    message: string
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const onLogin = async () => {
    if (!username || !password) {
      showToast("error", "Missing Fields", "Please fill in all fields.");
      return;
    }

    if (username.length < 3 || password.length < 3) {
      showToast("error", "Input Too Short", "Minimum length is 3 characters.");
      return;
    }

    if (username.length > 20 || password.length > 20) {
      showToast("error", "Input Too Long", "Maximum length is 20 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.151:1604/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const { token, user, message } = response.data;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        showToast("success", "Login Successful", message);
        router.push("/home/main");
      } else {
        showToast("error", "Login Failed", "Please check your credentials.");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      console.error("Login error:", error);
      showToast("error", "Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={{ flex: 1, width: "100%", height: "100%" }}
        >
          <View className="flex-1 justify-center px-6 bg-black/70">
            <Image
              source={logo}
              style={{
                width: 130,
                height: 170,
                marginBottom: 20,
                alignSelf: "center",
              }}
            />
            <Text className="text-4xl font-extrabold mb-10 text-center text-white">
              LOGIN
            </Text>

            {/* Username Input */}
            <View className="flex-row items-center border border-blue-200 rounded-2xl px-4 py-4 mb-5 bg-white shadow-md">
              <FontAwesome name="user" size={22} color="#888" />
              <TextInput
                placeholder="Username"
                className="ml-3 py-1 flex-1 text-gray-900 text-base"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center border border-blue-200 rounded-2xl px-4 py-4 mb-6 bg-white shadow-md">
              <Feather name="lock" size={22} color="#888" />
              <TextInput
                placeholder="Password"
                className="ml-3 py-1 flex-1 text-gray-900 text-base"
                placeholderTextColor="#aaa"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off" : "eye"}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="flex-row justify-center items-center bg-[#0446d5] rounded-2xl py-4 shadow-lg active:opacity-80"
              accessibilityLabel="Login"
              accessibilityHint="Log in to your account"
              onPress={onLogin}
            >
              <Text className="text-white text-lg font-semibold mr-2">
                Login
              </Text>
              <Feather name="log-in" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
