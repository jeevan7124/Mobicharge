import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const PaymentOptions = ({ params }) => {
  const router = useRouter();
  const { id, cost } = params;

  // Handle Payment Option Selection
  const handlePaymentOption = (paymentMethod) => {
    // Redirect to Charging Completion and pass the payment option
    router.push({
      pathname: "/ChargingCompletion",
      params: { id, cost, paymentMethod },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.appointmentText}>Cost: NPR {cost}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePaymentOption("Cash On Service")}
      >
        <Text style={styles.buttonText}>Cash On Service</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePaymentOption("Online Banking")}
      >
        <Text style={styles.buttonText}>Online Banking</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePaymentOption("Khalti")}
      >
        <Text style={styles.buttonText}>Khalti</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#21929d", marginBottom: 25 },
  appointmentText: { fontSize: 18, color: "#333", marginBottom: 8 },
  button: {
    backgroundColor: "#21929d",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});

export default PaymentOptions;