// SECTION 1: Imports and Global Variables
// Imports necessary dependencies for React Native, state management, navigation, API calls, and location services
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal, Platform } from "react-native";
import axios from "axios";
import { useRouter, useFocusEffect } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Global variables to store router instance, appointments, filters, and UI states
var my_router; // Stores the router instance for navigation
var all_appointments = []; // Stores the full list of appointments from API



// SECTION 2: Component Declaration and State Initialization
// Defines the AdminHome component, initializes state, and sets up navigation
const AdminHome = () => {
  // Get router instance from Expo Router for navigation
  const router = useRouter();
  my_router = router; // Assign to global variable (not recommended)

  // State variables for managing appointments, UI, and location
  const [appointments, setAppointments] = useState([]); // Full list of appointments
  const [filteredAppointments, setFilteredAppointments] = useState([]); // Filtered list of appointments
  const [loading, setLoading] = useState(false); // Tracks API loading state
  const [error, setError] = useState(null); // Stores error messages
  const [searchQuery, setSearchQuery] = useState(""); // Search input text
  const [statusFilter, setStatusFilter] = useState("All"); // Selected status filter
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for filtering
  const [showDatePicker, setShowDatePicker] = useState(false); // Controls date picker visibility
  const [listKey, setListKey] = useState(Date.now()); // Forces FlatList re-render
  
  // Location-related state for modal and map
  const [locationModalVisible, setLocationModalVisible] = useState(false); // Controls location modal visibility
  const [selectedLocation, setSelectedLocation] = useState(null); // Stores user location data
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Stores appointment for location modal
  const [fetchingLocation, setFetchingLocation] = useState(false); // Tracks location fetching state
  const [userLocations, setUserLocations] = useState({}); // Caches user locations by user ID

  // SECTION 3: Fetching Appointments
  // Fetches appointments from the backend API and handles responses/errors
  async function fetchAppointments() {
    // Set loading states
    setLoading(true);
    setError(null);
    isLoading = true;
    
    try {
      // Make GET request to fetch appointments
      const response = await axios.get("http://100.64.220.10:5000/api/appointment/getAppointments");
      console.log("API Response (fetchAppointments):", JSON.stringify(response.data, null, 2));
      
      // Store response data in global variable and validate
      all_appointments = response.data || [];
      if (!Array.isArray(all_appointments)) {
        throw new Error("Expected an array of appointments");
      }

      // Debug: Log status for appointment ID 24
      const appointment24 = all_appointments.find(item => item.id === 24);
      console.log(`Status for ID 24: ${appointment24 ? appointment24.status || 'NULL' : 'Not found'}`);

      // Set default status to "Pending" for appointments with no/empty status
      all_appointments.forEach(function(item) {
        if (!item.status || item.status === '') {
          item.status = "Pending";
        }
      });
      
      // Update state and global variables with fetched data
      console.log("Processed Appointments:", JSON.stringify(all_appointments, null, 2));
      setAppointments(all_appointments);
      setFilteredAppointments(all_appointments);
      filter_appointment = all_appointments;
      setListKey(Date.now()); // Force FlatList re-render
      
      // Handle empty response
      if (all_appointments.length === 0) {
        setError("No appointments found in the database.");
      }
    } catch (error) {
      // Handle errors with specific messages
      console.error("Error fetching appointments:", error);
      let errorMessage = "Failed to fetch appointments. Please try again.";
      if (error.response) {
        console.error("Response Error:", error.response.data);
        if (error.response.status === 500) {
          errorMessage = "Server error. Please check the backend.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection or server IP.";
      }
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      // Reset loading states
      setLoading(false);
      isLoading = false;
    }
  }

  // SECTION 4: Initial Setup and Effects
  // Sets up initial data fetching and location permissions on component mount
  useEffect(() => {
    console.log("useEffect called!");
    // Fetch appointments on mount
    fetchAppointments();
    
    // Request location permissions
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to fetch user locations');
          return;
        }
      } catch (err) {
        console.error("Error requesting location permissions:", err);
        Alert.alert('Error', 'Failed to request location permissions');
      }
    })();
  }, []); // Empty dependency array ensures this runs once on mount

  // Refreshes appointments when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("AdminHome focused, refreshing appointments");
      fetchAppointments();
    }, []) // Empty dependency array for memoization
  );

  // SECTION 5: Search and Filter Functions
  // Handles searching and filtering appointments by query, status, and date
  const handleSearch = function(query) {
    // Update search query state and global variable
    setSearchQuery(query);
    searchText = query;
    
    // Filter appointments based on search query
    var filteredData = [];
    
    for (var i = 0; i < appointments.length; i++) {
      var appointment = appointments[i];
      var carModel = appointment.carModel?.toLowerCase() || "";
      var carNumber = appointment.carNumber?.toLowerCase() || "";
      var ownerName = appointment.ownerName?.toLowerCase() || "";
      var searchLower = query.toLowerCase();
      
      // Include appointment if it matches search criteria
      if (carModel.includes(searchLower) || 
          carNumber.includes(searchLower) || 
          ownerName.includes(searchLower)) {
        filteredData.push(appointment);
      }
    }
    
    // Log and update filtered data
    console.log(`Search query: ${query}, Filtered data:`, JSON.stringify(filteredData, null, 2));
    setFilteredAppointments(filteredData);
    filter_appointment = filteredData;

    // Reset to full list if search query is empty
    if (query === "") {
      setFilteredAppointments(appointments);
      filter_appointment = appointments;
    }
  };

  // Filters appointments by status (All, Pending, Ongoing, Completed)
  function handleStatusFilter(status) {
    setStatusFilter(status);
    filter_status = status;
    
    var filteredData = [];
    
    // Show all appointments if "All" is selected
    if (status === "All") {
      filteredData = appointments;
    } else {
      // Filter by selected status
      for (var i = 0; i < appointments.length; i++) {
        if (appointments[i].status === status) {
          filteredData.push(appointments[i]);
        }
      }
    }
    
    // Log and update filtered data
    console.log(`Filtering by status: ${status}, Filtered data:`, JSON.stringify(filteredData, null, 2));
    setFilteredAppointments(filteredData);
    filter_appointment = filteredData;
    setListKey(Date.now()); // Force FlatList re-render
  }

  // Filters appointments by selected date
  function handleDateFilter(selectedDate) {
    setSelectedDate(selectedDate);
    today_date = selectedDate;
    
    // Format date as YYYY-M-D
    var day = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();
    
    var formattedDate = year + "-" + month + "-" + day;
    console.log("Date selected: " + formattedDate);

    // Filter appointments by date
    var filteredData = [];
    
    for (var i = 0; i < appointments.length; i++) {
      if (appointments[i].date?.startsWith(formattedDate)) {
        filteredData.push(appointments[i]);
      }
    }
    
    // Log and update filtered data
    console.log(`Filtering by date: ${formattedDate}, Filtered data:`, JSON.stringify(filteredData, null, 2));
    setFilteredAppointments(filteredData);
    filter_appointment = filteredData;
    setListKey(Date.now()); // Force FlatList re-render
  }

  // Shows the date picker
  function showDatepicker() {
    setShowDatePicker(true);
    show_date_picker = true;
  }

  // Hides the date picker
  function hideDatepicker() {
    setShowDatePicker(false);
    show_date_picker = false;
  }

  // SECTION 6: Appointment Actions
  // Handles ending a charging session by navigating to ChargingCompletion
  function handleEndCharging(appointmentId, cost) {
    console.log(`Navigating to ChargingCompletion with ID: ${appointmentId}, Cost: ${cost}`);
    // Validate appointment ID
    if (!appointmentId || isNaN(appointmentId)) {
      console.error("Invalid appointment ID:", appointmentId);
      Alert.alert("Error", "Invalid appointment ID.");
      return;
    }
    // Navigate to ChargingCompletion screen with parameters
    my_router.push({
      pathname: "/ChargingCompletion",
      params: { id: appointmentId.toString(), cost: cost.toString() },
    });
  }

  // Starts an appointment by updating its status to "Ongoing"
  async function handleStartAppointment(appointmentId) {
    const url = `http://100.64.220.10:5000/api/appointment/updateStatus/${appointmentId}`;
    console.log(`Attempting PATCH request to: ${url}`, {
      data: { status: "Ongoing" },
      headers: { 'Content-Type': 'application/json' }
    });

    // Prompt user to confirm starting the appointment
    Alert.alert(
      "Start Appointment",
      "Are you sure you want to start this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: async () => {
            try {
              // Send PATCH request to update status
              const response = await axios.patch(
                url,
                { status: "Ongoing" },
                { headers: { 'Content-Type': 'application/json' } }
              );

              // Handle success
              console.log("Appointment started successfully!", JSON.stringify(response.data, null, 2));
              Alert.alert("Success", response.data.message || "Appointment started.");
              setStatusFilter("All");
              setSearchQuery("");
              await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
              await fetchAppointments(); // Refresh appointments
            } catch (error) {
              // Handle errors with specific messages
              console.error("Error starting appointment:", error);
              let errorMessage = "Failed to start appointment.";
              if (error.response) {
                console.error("Response Error:", error.response.data);
                if (error.response.status === 404) {
                  errorMessage = "Appointment not found. It may have been deleted.";
                } else if (error.response.status === 400) {
                  errorMessage = error.response.data.message || "Invalid request data.";
                } else if (error.response.status === 500) {
                  errorMessage = "Server error. Please check the backend.";
                } else if (error.response.data && error.response.data.message) {
                  errorMessage = error.response.data.message;
                }
              } else if (error.message.includes("Network Error")) {
                errorMessage = "Network error. Please check your connection or server IP.";
              }
              // Show error with retry option
              Alert.alert("Error", errorMessage, [
                { text: "OK" },
                { text: "Retry", onPress: () => handleStartAppointment(appointmentId) }
              ]);
            }
          },
        },
      ]
    );
  }

  // SECTION 7: Location Handling
  // Fetches and displays a user's location for a pending appointment
  async function fetchUserLocation(appointment) {
    setFetchingLocation(true);
    setSelectedAppointment(appointment);
    
    try {
      const userId = appointment.userId;
      // Check if location is cached
      if (userLocations[userId]) {
        console.log("Using cached location for user:", userId);
        setSelectedLocation(userLocations[userId]);
        setLocationModalVisible(true);
        setFetchingLocation(false);
        return;
      }
      
      // Fetch current device location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      // Perform reverse geocoding to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      // Extract location name
      const locationName = addressResponse[0]?.city || 
                          addressResponse[0]?.district || 
                          addressResponse[0]?.region || 
                          'Unknown Area';
      
      // Create location object
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        description: locationName
      };
      
      console.log(`User location fetched for appointment ${appointment.id}:`, userLocation);
      
      // Cache location by user ID
      setUserLocations(prev => ({
        ...prev,
        [userId]: userLocation
      }));
      
      // Update state and show modal
      setSelectedLocation(userLocation);
      setLocationModalVisible(true);
    } catch (error) {
      // Handle location errors
      console.error("Error fetching location:", error);
      Alert.alert("Location Error", "Failed to retrieve user location. Make sure location services are enabled.");
    } finally {
      setFetchingLocation(false);
    }
  }

  // Triggers location fetch for pending appointments
  function viewUserLocation(item) {
    if (item.status === "Pending") {
      fetchUserLocation(item);
    }
  }

  // SECTION 8: Rendering Appointment Items
  // Renders each appointment item in the FlatList
  const renderAppointmentItem = function(props) {
    var item = props.item;
    // Set card background color based on status
    var cardColor = "#ffffff";
    
    if (item.status === "Completed") {
      cardColor = "#21929d"; // Teal for completed
    } else if (item.status === "Ongoing") {
      cardColor = "#ffd700"; // Gold for ongoing
    } else {
      cardColor = "#ffffff"; // White for pending
    }

    return (
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        {/* Display appointment details */}
        <Text style={styles.appointmentText}>Car Model: {item.carModel || "N/A"}</Text>
        <Text style={styles.appointmentText}>Car Number: {item.carNumber || "N/A"}</Text>
        <Text style={styles.appointmentText}>Owner: {item.ownerName || "N/A"}</Text>
        <Text style={styles.appointmentText}>Location: {item.location || "N/A"}</Text>
        <Text style={styles.appointmentText}>Cost: NPR {item.cost || "0"}</Text>
        <Text style={styles.appointmentText}>Status: {item.status || "Unknown"}</Text>

        <View style={styles.buttonContainer}>
          {/* Show buttons for pending appointments */}
          {item.status === "Pending" && (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#28a745" }]}
                onPress={function() { handleStartAppointment(item.id) }}
              >
                <Text style={styles.buttonText}>Start Appointment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007bff", marginTop: 10 }]}
                onPress={function() { viewUserLocation(item) }}
              >
                <Text style={styles.buttonText}>View User Location</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Show button for ongoing appointments */}
          {item.status === "Ongoing" && (
            <TouchableOpacity
              style={styles.button}
              onPress={function() { handleEndCharging(item.id, item.cost) }}
            >
              <Text style={styles.buttonText}>End Charging</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // SECTION 9: Refresh and Navigation
  // Handles manual data refresh and back navigation
  function refreshData() {
    console.log("Manual refresh initiated");
    // Reset filters and fetch appointments
    setStatusFilter("All");
    setSearchQuery("");
    fetchAppointments();
    Alert.alert("Success", "Data refresh initiated.");
  }
  
  // Navigates to the login screen
  function handleBack() {
    router.push("/login");
  }

  // SECTION 10: Main Render Method
  // Renders the main UI of the admin dashboard
  return (
    <View style={styles.container}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>
      
      {/* Refresh button */}
      <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>REFRESH DATA</Text>
      </TouchableOpacity>

      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by car model, number, or owner..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Status filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={function() { handleStatusFilter("All") }}>
          <Text style={[styles.filterButton, statusFilter === "All" ? {color: "#21929d"} : {}]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={function() { handleStatusFilter("Pending") }}>
          <Text style={[styles.filterButton, statusFilter === "Pending" ? {color: "#21929d"} : {}]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={function() { handleStatusFilter("Ongoing") }}>
          <Text style={[styles.filterButton, statusFilter === "Ongoing" ? {color: "#21929d"} : {}]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={function() { handleStatusFilter("Completed") }}>
          <Text style={[styles.filterButton, statusFilter === "Completed" ? {color: "#21929d"} : {}]}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Date filter */}
      <TouchableOpacity onPress={showDatepicker}>
        <Text style={styles.dateFilterText}>
          {selectedDate ? `Date: ${selectedDate.toLocaleDateString()}` : "Select a Date"}
        </Text>
      </TouchableOpacity>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={function(event, selectedDate) {
            hideDatepicker();
            if (selectedDate) {
              handleDateFilter(selectedDate);
            }
          }}
        />
      )}

      {/* Conditional content: loading, error, or appointment list */}
      {loading ? (
        <Text style={styles.loadingText}>Loading appointments...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredAppointments.length === 0 ? (
        <Text style={styles.errorText}>No appointments match your filters.</Text>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={function(item) { return item.id.toString() }}
          style={styles.appointmentList}
          key={listKey}
        />
      )}
      
      {/* Display total and filtered appointment counts */}
      <Text style={{fontSize: 10, color: "gray"}}>
        Total items: {appointments.length}, Filtered items: {filteredAppointments.length}
      </Text>

      {/* Location modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => {
          setLocationModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User GPS Location</Text>
            
            {/* Conditional content: loading, location, or error */}
            {fetchingLocation ? (
              <Text style={styles.loadingText}>Fetching GPS coordinates...</Text>
            ) : selectedLocation ? (
              <View style={styles.locationContainer}>
                <View style={styles.coordinatesContainer}>
                  <Text style={styles.coordinatesText}>
                    Latitude: {selectedLocation.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinatesText}>
                    Longitude: {selectedLocation.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinatesText}>
                    Area: {selectedLocation.description || 'Unknown'}
                  </Text>
                </View>
                
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                      }}
                      title={selectedAppointment?.ownerName || "User"}
                      description={`Car: ${selectedAppointment?.carModel || "N/A"}`}
                    />
                  </MapView>
                </View>
              </View>
            ) : (
              <Text style={styles.errorText}>Failed to load location</Text>
            )}

            {/* Modal footer with buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#323b34", marginTop: 10 }]}
                onPress={() => setLocationModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              
              {selectedAppointment && selectedAppointment.status === "Pending" && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#28a745", marginTop: 10 }]}
                  onPress={() => {
                    setLocationModalVisible(false);
                    handleStartAppointment(selectedAppointment.id);
                  }}
                >
                  <Text style={styles.buttonText}>Start Appointment</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// SECTION 11: Styles
// Defines styles for the UI using React Native's StyleSheet
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f1f1f1", 
    padding: 20 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 25,
  },
  backButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#21929d",
    fontWeight: "bold",
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#21929d", 
    flex: 1 
  },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  filterContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 20 
  },
  filterButton: { 
    fontSize: 16, 
    color: "#21929d", 
    fontWeight: "bold" 
  },
  appointmentList: { 
    marginTop: 15 
  },
  card: {
    padding: 18,
    marginBottom: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#323b34",
    shadowColor: "#323b34",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  appointmentText: { 
    fontSize: 18, 
    color: "#323b34", 
    marginBottom: 8 
  },
  button: { 
    backgroundColor: "#21929d", 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 15, 
    alignItems: "center" 
  },
  buttonText: { 
    fontSize: 16, 
    color: "#fff", 
    fontWeight: "bold" 
  },
  loadingText: { 
    textAlign: "center", 
    fontSize: 18, 
    color: "#323b34" 
  },
  errorText: { 
    textAlign: "center", 
    fontSize: 18, 
    color: "#ff0000" 
  },
  dateFilterText: { 
    fontSize: 16, 
    color: "#21929d", 
    textAlign: "center", 
    marginBottom: 20 
  },
  refreshButton: { 
    backgroundColor: "#323b34", 
    padding: 10, 
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
  },
  refreshButtonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  buttonContainer: { 
    flexDirection: "column", 
    gap: 10 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#21929d',
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  locationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  coordinatesContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  coordinatesText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#323b34',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

// Export the component
export default AdminHome;