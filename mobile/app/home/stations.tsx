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

interface Station {
  _id?: string;
  name: string;
  code: string;
  country: string;
  city: string;
  openedYear?: number;
  platforms?: number;
  isActive?: boolean;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Station>({
    name: "",
    code: "",
    country: "",
    city: "",
    openedYear: undefined,
    platforms: 2,
    isActive: true,
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get("/station");
      setStations(res.data);
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };

  const handleChange = (field: keyof Station, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (index: number, value: string) => {
    const coordinates = [...form.location.coordinates] as [number, number];
    coordinates[index] = parseFloat(value);
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, coordinates },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/station/${editId}`, form);
      } else {
        await axios.post("/station", form);
      }
      fetchStations();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Error saving station:", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      country: "",
      city: "",
      openedYear: undefined,
      platforms: 2,
      isActive: true,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    });
    setEditId(null);
  };

  const handleEdit = (station: Station) => {
    setForm(station);
    setEditId(station._id || null);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this station?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await axios.delete(`/station/${id}`);
          fetchStations();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stations List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Station</Text>
      </TouchableOpacity>

      <FlatList
        data={stations}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>🏢 Name: {item.name}</Text>
            <Text>🔢 Code: {item.code}</Text>
            <Text>
              🌍 {item.city}, {item.country}
            </Text>
            <Text>📅 Opened: {item.openedYear || "Unknown"}</Text>
            <Text>🚉 Platforms: {item.platforms}</Text>
            <Text>📍 Location: [{item.location.coordinates.join(", ")}]</Text>

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
        )}
      />

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editId ? "Edit Station" : "Add New Station"}
            </Text>

            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Code"
              value={form.code}
              onChangeText={(text) => handleChange("code", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Country"
              value={form.country}
              onChangeText={(text) => handleChange("country", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="City"
              value={form.city}
              onChangeText={(text) => handleChange("city", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Opened Year"
              value={form.openedYear?.toString() || ""}
              onChangeText={(text) =>
                handleChange("openedYear", parseInt(text) || 0)
              }
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Platforms"
              value={form.platforms?.toString() || "2"}
              onChangeText={(text) =>
                handleChange("platforms", parseInt(text) || 2)
              }
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Longitude"
              value={form.location.coordinates[0]?.toString()}
              onChangeText={(text) => handleLocationChange(0, text)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Latitude"
              value={form.location.coordinates[1]?.toString()}
              onChangeText={(text) => handleLocationChange(1, text)}
              style={styles.input}
              keyboardType="numeric"
            />

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
