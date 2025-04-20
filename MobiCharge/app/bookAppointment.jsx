import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

const BookAppointment = () => {
  const [chargingType, setChargingType] = useState("normal");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [chargingModalVisible, setChargingModalVisible] = useState(false);
  const [batteryModalVisible, setBatteryModalVisible] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  const chargingOptions = [
    { value: "normal", label: "Normal Charging" },
    { value: "fast", label: "Fast Charging" },
  ];

  const batteryOptions = [
    { value: "below20", label: "Below 20 kWh" },
    { value: "21-40", label: "21 - 40 kWh" },
    { value: "41-60", label: "41 - 60 kWh" },
    { value: "61-80", label: "61 - 80 kWh" },
    { value: "81-100", label: "81 - 100 kWh" },
    { value: "101-120", label: "101 - 120 kWh" },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  const detectCurrentLocation = async () => {
    console.log('Thanks for lettiing US use Your Location Location Tracking on way');
    if (!locationPermission) {
      Alert.alert("Permission Required", "Location access is required.");
      return;

    }

    setIsDetectingLocation(true);
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const response = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (response && response.length > 0) {
        const address = response[0];
        const formattedAddress = [
          address.name,
          address.street,
          address.district,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");
        
        setLocation(formattedAddress);
      } else {
        setLocation(`${coords.latitude}, ${coords.longitude}`);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      Alert.alert("Error", "Couldn't detect your location.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async () => {
    console.log('Booking Done Sucefully धन्यवाद धन्यवाद धन्यवाद');
    if (
      !chargingType ||
      !batteryCapacity ||
      !carModel ||
      !carNumber ||
      !ownerName ||
      !phoneNumber ||
      !location
    ) {
      Alert.alert("Error", "Please fill out all fields.");
    
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert("Error", "Please log in to book an appointment.");
      return;
    }

    const appointmentData = {
      chargingType,
      batteryCapacity: parseInt(batteryCapacity),
      carModel,
      carNumber,
      ownerName,
      phoneNumber,
      location,
    };

    try {
      const response = await axios.post("http://100.64.220.10:5000/api/appointment/book", appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Thanks for booking Our team will contact you... धन्यवाद धन्यवाद धन्यवाद!");
        resetForm();
      } else {
        Alert.alert("Error", response.data.message || "An issue occurred while booking.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Error", error.response?.data?.message || "Server error occurred.");
    }
  };

  const resetForm = () => {
    setChargingType("normal");
    setBatteryCapacity("");
    setCarModel("");
    setCarNumber("");
    setOwnerName("");
    setPhoneNumber("");
    setLocation("");
  };

  const closeChargingModal = (option) => {
    if (option) setChargingType(option.value);
    setChargingModalVisible(false);
  };

  const closeBatteryModal = (option) => {
    if (option) setBatteryCapacity(option.value);
    setBatteryModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.inner}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

          <View style={styles.header}>
            <Text style={styles.title}>Appointment Booking</Text>
            <FontAwesome5 name="calendar-check" size={40} color="#ffffff" />
          </View>

          {/* Personal Information */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TextInput style={styles.input} placeholder="Owner Name" value={ownerName} onChangeText={setOwnerName} placeholderTextColor="rgba(0, 0, 0, 0.5)" />
            <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholderTextColor="rgba(0, 0, 0, 0.5)" />
          </View>

          {/* Vehicle Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Info</Text>
            <TextInput style={styles.input} placeholder="Vehicle Model" value={carModel} onChangeText={setCarModel} placeholderTextColor="rgba(0, 0, 0, 0.5)" />
            <TextInput style={styles.input} placeholder="Vehicle Number" value={carNumber} onChangeText={setCarNumber} placeholderTextColor="rgba(0, 0, 0, 0.5)" />
          </View>

          {/* Charging Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Charging Details</Text>

            {/* Charging Type Dropdown */}
            <TouchableOpacity style={styles.dropdown} onPress={() => setChargingModalVisible(true)}>
              <Text style={styles.inputText}>{chargingType ? chargingOptions.find(option => option.value === chargingType)?.label : "Select Charging Type"}</Text>
              <Ionicons name="chevron-down" size={24} color="#21929d" />
            </TouchableOpacity>

            {/* Battery Capacity Dropdown */}
            <TouchableOpacity style={styles.dropdown} onPress={() => setBatteryModalVisible(true)}>
              <Text style={styles.inputText}>{batteryCapacity ? batteryOptions.find(option => option.value === batteryCapacity)?.label : "Select Battery Capacity"}</Text>
              <Ionicons name="chevron-down" size={24} color="#21929d" />
            </TouchableOpacity>

            {/* Location */}
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} placeholderTextColor="rgba(0, 0, 0, 0.5)" />
            <TouchableOpacity style={styles.detectButton} onPress={detectCurrentLocation}>
              {isDetectingLocation ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.detectButtonText}>Detect Location</Text>}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Book Appointment</Text>
          </TouchableOpacity>

          {/* Charging Type Modal */}
          <Modal visible={chargingModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Charging Type</Text>
                {chargingOptions.map(option => (
                  <TouchableOpacity key={option.value} onPress={() => closeChargingModal(option)}>
                    <Text style={styles.modalItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setChargingModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Battery Capacity Modal */}
          <Modal visible={batteryModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Battery Capacity</Text>
                {batteryOptions.map(option => (
                  <TouchableOpacity key={option.value} onPress={() => closeBatteryModal(option)}>
                    <Text style={styles.modalItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setBatteryModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  inner: { padding: 20 },
  header: { backgroundColor: "#21929d", padding: 20, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 8, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#21929d" },
  input: { height: 45, color: "#020302", borderColor: "#21929d", borderWidth: 1, borderRadius: 5, paddingLeft: 10, fontSize: 16, marginBottom: 15 },
  inputText: { fontSize: 16, color: "#020302" },
  dropdown: { height: 45, borderColor: "#21929d", borderWidth: 1, borderRadius: 5, justifyContent: "center", paddingLeft: 10, marginBottom: 15 },
  detectButton: { backgroundColor: "#21929d", padding: 10, borderRadius: 5, marginBottom: 20 },
  detectButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  submitButton: { backgroundColor: "#21929d", padding: 15, borderRadius: 5 },
  submitButtonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 8, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#21929d" },
  modalItemText: { fontSize: 16, color: "#21929d", paddingVertical: 10, textAlign: "center" },
  modalCloseButton: { backgroundColor: "#21929d", marginTop: 10, padding: 10, borderRadius: 5 },
  modalCloseText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

export default BookAppointment;