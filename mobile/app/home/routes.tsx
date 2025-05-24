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
import MultiSelect from "react-native-multiple-select";
import axios from "../../utils/axios";

interface Station {
  _id: string;
  name: string;
}

interface Route {
  _id?: string;
  name: string;
  stations: { stationId: string; order: number }[];
  distance: number;
  estimatedTime: number;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Route>({
    name: "",
    stations: [],
    distance: 0,
    estimatedTime: 0,
  });
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([]);
  const [stationOrders, setStationOrders] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  const fetchRoutes = async () => {
    const res = await axios.get("/route");
    setRoutes(res.data);
  };

  const fetchStations = async () => {
    const res = await axios.get("/station");
    setStations(res.data);
  };

  const handleChange = (field: keyof Route, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const selectedStations = selectedStationIds.map((id) => ({
        stationId: id,
        order: parseInt(stationOrders[id]) || 0,
      }));

      const updatedForm = { ...form, stations: selectedStations };

      if (editId) {
        await axios.put(`/route/${editId}`, updatedForm);
      } else {
        await axios.post("/route", updatedForm);
      }
      fetchRoutes();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  const handleEdit = (route: Route) => {
    setForm(route);
    setEditId(route._id || null);
    const ids = route.stations.map((s) => s.stationId);
    const orders: { [key: string]: string } = {};
    route.stations.forEach((s) => (orders[s.stationId] = String(s.order)));
    setSelectedStationIds(ids);
    setStationOrders(orders);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this route?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await axios.delete(`/route/${id}`);
          fetchRoutes();
        },
      },
    ]);
  };

  const resetForm = () => {
    setForm({
      name: "",
      stations: [],
      distance: 0,
      estimatedTime: 0,
    });
    setEditId(null);
    setSelectedStationIds([]);
    setStationOrders({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes List</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Route</Text>
      </TouchableOpacity>

      <FlatList
        data={routes}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>🛤 Name: {item.name}</Text>
            <Text>📍 Distance: {item.distance} km</Text>
            <Text>⏱ Time: {item.estimatedTime} min</Text>
            <Text>🚉 Stations:</Text>
            {item.stations
              .sort((a, b) => a.order - b.order)
              .map((s, idx) => {
                const stationName =
                  stations.find((st) => st._id === s.stationId)?.name ||
                  s.stationId;
                return (
                  <Text key={idx}>
                    {s.order}. {stationName}
                  </Text>
                );
              })}

            <View style={styles.actions}>
              <Pressable
                onPress={() => handleEdit(item)}
                style={styles.editButton}
              >
                <Text style={styles.addButtonText}>Edit</Text>
              </Pressable>
              <Pressable
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
              {editId ? "Edit Route" : "Add New Route"}
            </Text>

            <TextInput
              placeholder="Route Name"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
              style={styles.input}
            />

            <TextInput
              placeholder="Distance (km)"
              value={form.distance.toString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleChange("distance", parseFloat(text) || 0)
              }
              style={styles.input}
            />

            <TextInput
              placeholder="Estimated Time (min)"
              value={form.estimatedTime.toString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleChange("estimatedTime", parseFloat(text) || 0)
              }
              style={styles.input}
            />

            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Select Stations:
            </Text>

            <MultiSelect
              items={stations}
              uniqueKey="_id"
              onSelectedItemsChange={setSelectedStationIds}
              selectedItems={selectedStationIds}
              selectText="Pick Stations"
              searchInputPlaceholderText="Search Stations..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#000"
              selectedItemTextColor="#007bff"
              selectedItemIconColor="#007bff"
              itemTextColor="#000"
              displayKey="name"
              styleDropdownMenuSubsection={styles.input}
              submitButtonColor="#007bff"
              submitButtonText="Confirm"
            />

            {selectedStationIds.map((id) => (
              <TextInput
                key={id}
                placeholder={`Order for ${
                  stations.find((s) => s._id === id)?.name
                }`}
                value={stationOrders[id] || ""}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setStationOrders((prev) => ({ ...prev, [id]: value }))
                }
                style={styles.input}
              />
            ))}

            <View style={styles.modalButtons}>
              <Pressable onPress={handleSubmit} style={styles.saveButton}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.cancelButton}
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
    marginTop: 40,
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
