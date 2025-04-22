import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

const ChargingCompletion = () => {
  const router = useRouter();
  const { id, cost } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // Initialize as empty to require selection
  const paymentMethods = ["Cash", "Online", "Card"]; // Match database ENUM values

  useEffect(() => {
    console.log(`ChargingCompletion loaded: ID=${id}, Cost=${cost}`);
    if (!id || isNaN(id)) {
      console.error("Invalid or missing appointment ID:", id);
      Alert.alert("Error", "Invalid appointment ID.");
      router.back();
    }
  }, [id, cost]);

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    console.log(`Selected payment method: ${method}`);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method (Cash, Online, or Card).");
      return false;
    }

    console.log(`Updating payment status for ID: ${id}, Method: ${paymentMethod}`);
    try {
      const response = await axios.post(
        "http://100.64.220.10:5000/api/appointment/updatePaymentStatus",
        { appointmentId: id, paymentMethod },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Payment status and method updated:", JSON.stringify(response.data, null, 2));
      return true;
    } catch (error) {
      console.error("Error updating payment status:", error);
      let errorMessage = "Failed to update payment status and method.";
      if (error.response) {
        console.error("Response Error:", error.response.data);
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid payment method. Please select Cash, Online, or Card.";
        } else if (error.response.status === 404) {
          errorMessage = "Appointment not found.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please check the backend.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }
      Alert.alert("Error", errorMessage);
      return false;
    }
  };

  const handleCompleteCharging = async () => {
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method (Cash, Online, or Card).");
      return;
    }

    setLoading(true);
    console.log(`Attempting to complete charging for ID: ${id}`);

    try {
      // Update payment status and method first
      const paymentUpdated = await handleUpdatePaymentStatus();
      if (!paymentUpdated) {
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://100.64.220.10:5000/api/appointment/completeChargingSession",
        { appointmentId: id },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Charging completed successfully!", JSON.stringify(response.data, null, 2));
      Alert.alert("Success", response.data.message || "Charging session completed.", [
        {
          text: "OK",
          onPress: () => router.replace("/admin-home"),
        },
      ]);
    } catch (error) {
      console.error("Error completing charging:", error);
      let errorMessage = "Failed to complete charging.";
      if (error.response) {
        console.error("Response Error:", error.response.data);
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid request data.";
        } else if (error.response.status === 404) {
          errorMessage = "Appointment not found or endpoint unavailable.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please check the backend.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }
      Alert.alert("Error", errorMessage, [
        { text: "OK" },
        { text: "Retry", onPress: handleCompleteCharging },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Charging Session</Text>
      <Text style={styles.info}>Appointment ID: {id || "N/A"}</Text>
      <Text style={styles.info}>Cost: NPR {cost || "0"}</Text>
      
      <Text style={styles.label}>Select Payment Method:</Text>
      <View style={styles.paymentMethodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentButton,
              paymentMethod === method && styles.paymentButtonSelected,
            ]}
            onPress={() => handleSelectPaymentMethod(method)}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentMethod === method && styles.paymentButtonTextSelected,
              ]}
            >
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleCompleteCharging}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Completing..." : "Confirm Completion"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc3545" }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#21929d",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: "#323b34",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#323b34",
    textAlign: "center",
    marginBottom: 10,
  },
  paymentMethodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#323b34",
  },
  paymentButtonSelected: {
    backgroundColor: "#21929d",
    borderColor: "#21929d",
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#323b34",
    textAlign: "center",
  },
  paymentButtonTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#21929d",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChargingCompletion;