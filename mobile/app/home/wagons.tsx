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

interface Vagon {
  _id?: string;
  number: string;
  type: string;
  capacityTons: number;
  volumeM3?: number;
  axles?: number;
  yearBuilt?: number;
  owner?: string;
  lastInspection?: string;
  isOperational?: boolean;
}

export default function WagonsPage() {
  const [wagons, setWagons] = useState<Vagon[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form, setForm] = useState<Vagon>({
    number: "",
    type: "",
    capacityTons: 0,
    volumeM3: undefined,
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchWagons();
  }, []);

  const fetchWagons = async () => {
    try {
      const res = await axios.get("/vagon");
      setWagons(res.data);
    } catch (err) {
      console.error("Error fetching wagons:", err);
    }
  };

  const handleChange = (field: keyof Vagon, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/vagon/${editId}`, form);
      } else {
        await axios.post("/vagon", form);
      }
      fetchWagons();
      setModalVisible(false);
      setForm({ number: "", type: "", capacityTons: 0 });
      setEditId(null);
    } catch (err) {
      console.error("Error saving wagon:", err);
    }
  };

  const handleEdit = (wagon: Vagon) => {
    setForm(wagon);
    setEditId(wagon._id || null);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this wagon?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await axios.delete(`/vagon/${id}`);
          fetchWagons();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Wagons List
      </Text>

      <TouchableOpacity
        accessibilityLabel="Add new wagon"
        onPress={() => {
          setForm({ number: "", type: "", capacityTons: 0 });
          setEditId(null);
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Wagon</Text>
      </TouchableOpacity>

      <FlatList
        data={wagons}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>🚂 Number: {item.number}</Text>
            <Text>📦 Type: {item.type}</Text>
            <Text>⚖️ Capacity: {item.capacityTons} tons</Text>

            <View style={styles.actions}>
              <Pressable
                accessibilityLabel="Edit wagon"
                onPress={() => handleEdit(item)}
                style={styles.editButton}
              >
                <Text style={styles.addButtonText}>Edit</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Delete wagon"
                onPress={() => handleDelete(item._id!)}
                style={styles.deleteButton}
              >
                <Text style={styles.addButtonText}>Delete</Text>
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
              {editId ? "Edit Wagon" : "Add New Wagon"}
            </Text>

            <TextInput
              placeholder="Number"
              value={form.number}
              onChangeText={(text) => handleChange("number", text)}
              style={styles.input}
              accessibilityLabel="Wagon number"
            />
            <TextInput
              placeholder="Type"
              value={form.type}
              onChangeText={(text) => handleChange("type", text)}
              style={styles.input}
              accessibilityLabel="Wagon type"
            />
            <TextInput
              placeholder="Capacity Tons"
              value={form.capacityTons.toString()}
              onChangeText={(text) =>
                handleChange("capacityTons", parseFloat(text) || 0)
              }
              keyboardType="numeric"
              style={styles.input}
              accessibilityLabel="Capacity in tons"
            />
            <TextInput
              placeholder="Volume (m³)"
              value={form.volumeM3?.toString() || ""}
              onChangeText={(text) =>
                handleChange("volumeM3", parseFloat(text) || 0)
              }
              keyboardType="numeric"
              style={styles.input}
              accessibilityLabel="Volume in cubic meters"
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={handleSubmit}
                style={styles.saveButton}
                accessibilityLabel="Save wagon"
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setEditId(null);
                }}
                style={styles.cancelButton}
                accessibilityLabel="Cancel"
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
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
    marginBottom: 12,
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
    marginTop: 8,
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
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#a74c28",
    padding: 10,
    borderRadius: 6,
    marginLeft: 5,
  },
});
