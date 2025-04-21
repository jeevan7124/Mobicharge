import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TrackVehicleScreen = () => {
  const [userLoc, setUserLoc] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  // Get permission and track user location
  const trackLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Location permission denied.');
      return;
    }
    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 10000 },
      (loc) => setUserLoc({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
    );
  };

  useEffect(() => {
    trackLocation();
  }, []);

  // Show error if any
  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name='arrow-back' size={24} color='#21929d' />
      </TouchableOpacity>

      {userLoc ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: userLoc.latitude,
              longitude: userLoc.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={userLoc}
              title='You'
              description='Your current location'
              pinColor='teal'
            />
          </MapView>

          <TouchableOpacity style={styles.refreshButton} onPress={trackLocation}>
            <MaterialIcons name='refresh' size={24} color='#fff' />
            <Text style={styles.refreshText}>Refresh Location</Text>
          </TouchableOpacity>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: 'teal' }]} />
              <Text style={styles.legendText}>You</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='#21929d' />
          <Text style={styles.loadingText}>Fetching your location...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#21929d',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    elevation: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  legend: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: { fontSize: 14, color: '#333', fontWeight: '500' },
});

export default TrackVehicleScreen;
