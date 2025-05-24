import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "../../utils/axios";

// wagons, routes, stations interfeyslarni alohida yarataman
interface Wagon {
  _id: string;
  name: string;
  type: string;
}

interface Route {
  _id: string;
  name: string;
}

interface Station {
  _id: string;
  name: string;
  city: string;
}

interface Train {
  _id?: string;
  name: string;
  route: string; // route id
  currentStation: string; // station id
  wagons: string[]; // array of wagon ids
}

export default function TrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [wagons, setWagons] = useState<Wagon[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Train>({
    name: "",
    route: "",
    currentStation: "",
    wagons: [],
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [trainsRes, routesRes, stationsRes, wagonsRes] = await Promise.all([
        axios.get("/train"),
        axios.get("/route"),
        axios.get("/station"),
        axios.get("/vagon"),
      ]);
      setTrains(trainsRes.data);
      setRoutes(routesRes.data);
      setStations(stationsRes.data);
      setWagons(wagonsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleChange = (field: keyof Train, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // wagons uchun toggle funksiyasi (multi select)
  const toggleWagon = (id: string) => {
    setForm((prev) => {
      if (prev.wagons.includes(id)) {
        return { ...prev, wagons: prev.wagons.filter((w) => w !== id) };
      } else {
        return { ...prev, wagons: [...prev.wagons, id] };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/train/${editId}`, form);
      } else {
        await axios.post("/train", form);
      }
      fetchAllData();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Error saving train:", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      route: "",
      currentStation: "",
      wagons: [],
    });
    setEditId(null);
  };

  const handleEdit = (train: Train) => {
    setForm(train);
    setEditId(train._id || null);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this train?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await axios.delete(`/train/${id}`);
          fetchAllData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trains List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Train</Text>
      </TouchableOpacity>

      <FlatList
        data={trains}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => {
          const routeName =
            routes.find((r) => r._id === item.route)?.name || "Unknown";
          const currentStationName =
            stations.find((s) => s._id === item.currentStation)?.name ||
            "Unknown";
          const wagonNames = wagons
            .filter((w) => item.wagons.includes(w._id))
            .map((w) => w.name)
            .join(", ");

          return (
            <View style={styles.item}>
              <Text>🚆 Name: {item.name}</Text>
              <Text>🛤 Route: {routeName}</Text>
              <Text>📍 Current Station: {currentStationName}</Text>
              <Text>🚃 Wagons: {wagonNames || "None"}</Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => handleEdit(item)}
                  style={styles.editButton}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item._id!)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editId ? "Edit Train" : "Add New Train"}
            </Text>

            <TextInput
              placeholder="Train Name"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
              style={styles.input}
            />

            {/* Single Select for Route */}
            <Text style={styles.label}>Select Route:</Text>
            <View style={styles.selectContainer}>
              {routes.map((route) => (
                <Pressable
                  key={route._id}
                  onPress={() => handleChange("route", route._id)}
                  style={[
                    styles.selectItem,
                    form.route === route._id && styles.selectItemSelected,
                  ]}
                >
                  <Text
                    style={
                      form.route === route._id
                        ? styles.selectItemTextSelected
                        : styles.selectItemText
                    }
                  >
                    {route.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Single Select for Current Station */}
            <Text style={styles.label}>Select Current Station:</Text>
            <View style={styles.selectContainer}>
              {stations.map((station) => (
                <Pressable
                  key={station._id}
                  onPress={() => handleChange("currentStation", station._id)}
                  style={[
                    styles.selectItem,
                    form.currentStation === station._id &&
                      styles.selectItemSelected,
                  ]}
                >
                  <Text
                    style={
                      form.currentStation === station._id
                        ? styles.selectItemTextSelected
                        : styles.selectItemText
                    }
                  >
                    {station.name} ({station.city})
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Multi Select for Wagons */}
            <Text style={styles.label}>Select Wagons:</Text>
            <View style={styles.selectContainer}>
              {wagons.map((wagon) => {
                const selected = form.wagons.includes(wagon._id);
                return (
                  <Pressable
                    key={wagon._id}
                    onPress={() => toggleWagon(wagon._id)}
                    style={[
                      styles.selectItem,
                      selected && styles.selectItemSelected,
                    ]}
                  >
                    <Text
                      style={
                        selected
                          ? styles.selectItemTextSelected
                          : styles.selectItemText
                      }
                    >
                      {wagon.name} ({wagon.type})
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <Pressable onPress={handleSubmit} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 2,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#ffc107",
    padding: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 6,
    borderRadius: 4,
  },
  modalView: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  selectItem: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  selectItemSelected: {
    backgroundColor: "#007bff",
  },
  selectItemText: {
    color: "#000",
  },
  selectItemTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#a74c28",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
