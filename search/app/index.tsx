import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "../utils/axios";

interface VagonData {
  vagon: {
    number: string;
    type: string;
    capacityTons: number;
    volumeM3: number;
    axles: number;
    yearBuilt: number;
    owner: string;
    lastInspection: string;
    isOperational: boolean;
  };
  train?: {
    name?: string;
    status?: string;
    departureTime?: string;
    arrivalTime?: string;
    route?: {
      name: string;
      distance: number;
      estimatedTime: number;
    };
    currentStation?: any;
  };
}

export default function SearchScreen() {
  const [query, setQuery] = useState<string>("");
  const [vagonData, setVagonData] = useState<VagonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getData = async () => {
    if (!query) {
      Alert.alert("Xatolik", "Iltimos, vagon raqamini kiriting.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setVagonData(null);
      const res = await axios.get<VagonData>(`/vagon/search/${query}`);
      setVagonData(res.data);
    } catch (e: any) {
      console.error(e);
      setError("Vagon raqami noto'g'ri kiritildi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Vagon Qidiruv
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Vagon raqamini kiriting (masalan: 2349857)"
        value={query}
        onChangeText={setQuery}
        keyboardType="number-pad"
        accessible={true}
        accessibilityLabel="Vagon raqami kiriting"
      />

      <TouchableOpacity style={styles.button} onPress={getData}>
        <Text style={styles.buttonText}>Qidirish</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          accessibilityLabel="Yuklanmoqda..."
          accessible={true}
        />
      )}

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          ❌ {error}
        </Text>
      ) : null}

      {vagonData && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Vagon Ma'lumotlari</Text>

          <Text>🚋 Raqami: {vagonData.vagon.number}</Text>
          <Text>Turi: {vagonData.vagon.type}</Text>
          <Text>Tonnasi: {vagonData.vagon.capacityTons} tonna</Text>
          <Text>Hajmi: {vagonData.vagon.volumeM3} m³</Text>
          <Text>O'qlari soni: {vagonData.vagon.axles}</Text>
          <Text>Yaratilgan yili: {vagonData.vagon.yearBuilt}</Text>
          <Text>Egalik qiluvchi: {vagonData.vagon.owner}</Text>
          <Text>
            Oxirgi tex ko‘rik:{" "}
            {new Date(vagonData.vagon.lastInspection).toLocaleDateString()}
          </Text>
          <Text>
            Holati: {vagonData.vagon.isOperational ? "Ishlayapti" : "Nosoz"}
          </Text>

          <Text style={styles.resultTitle}>Poezd Ma'lumotlari</Text>
          <Text>Nomi: {vagonData.train?.name || "Biriktirilmagan"}</Text>
          <Text>Holati: {vagonData.train?.status || "Noaniq"}</Text>
          <Text>
            Jo‘nash vaqti:{" "}
            {vagonData.train?.departureTime
              ? new Date(vagonData.train.departureTime).toLocaleString()
              : "-"}
          </Text>
          <Text>
            Yetib borish vaqti:{" "}
            {vagonData.train?.arrivalTime
              ? new Date(vagonData.train.arrivalTime).toLocaleString()
              : "-"}
          </Text>
          <Text>Marshrut: {vagonData.train?.route?.name || "Noma‘lum"}</Text>
          <Text>Masofa: {vagonData.train?.route?.distance || 0} km</Text>
          <Text>
            Taxminiy vaqt: {vagonData.train?.route?.estimatedTime || 0} daqiqa
          </Text>
        </View>
      )}

      {!vagonData && !loading && !error && (
        <Image
          source={require("../assets/images/no.png")}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Ma'lumot topilmadi rasmi"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
});
