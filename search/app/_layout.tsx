import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}
