import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit mode
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: ''
  });

  const isTokenExpired = (decodedToken) => {
    if (!decodedToken.exp) return true;
    return decodedToken.exp < Date.now() / 1000;
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Loggedout the current user');
      navigation.reset({ index: 0, routes: [{ name: 'login' }] });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewAppointment = () => {
    navigation.navigate('ViewAppointment');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Fetching User data');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (decodeError) {
        setError('Invalid token format. Please log in again.');
        setLoading(false);
        return;
      }

      if (isTokenExpired(decodedToken)) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://192.168.1.77:5000/api/user/Profile', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });

      if (response.data && response.data.profile) {
        setUserProfile(response.data.profile);
        setNewUserData({
          fullName: response.data.profile.fullName,
          phone: response.data.profile.phone,
          address: response.data.profile.address,
          email: response.data.profile.email,
        });
      } else {
        setError('Invalid profile data received.');
      }
    } catch (apiError) {
      if (apiError.response) {
        setError(`Server error: ${apiError.response.status}`);
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    console.log('Save button clicked'); // Add this to check if it's being called
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('You need to log in again!');
      return;
    }
  
    try {
      const response = await axios.put(
        'http://192.168.1.77:5000/api/user/profile',
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.message === 'Profile updated successfully') {
        setUserProfile((prevState) => ({
          ...prevState,
          fullName: newUserData.fullName,
          phone: newUserData.phone,
          address: newUserData.address,
          email: newUserData.email,
        }));
  
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <LinearGradient colors={['#ffff', '#36e6f7', '#36e6f7']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : userProfile ? (
        <View style={styles.profileContainer}>
          <Image source={require('../assets/profilePic.png')} style={styles.profilePic} />
          
          <View style={styles.fieldContainer}>
            <Icon name="person" size={20} color="#4c669f" style={styles.icon} />
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={newUserData.fullName}
                onChangeText={(text) => setNewUserData({ ...newUserData, fullName: text })}
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.fullName}</Text>
            )}
          </View>
          
          <View style={styles.fieldContainer}>
            <Icon name="email" size={20} color="#4c669f" style={styles.icon} />
            <Text style={styles.fieldLabel}>Email Address</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={newUserData.email}
                onChangeText={(text) => setNewUserData({ ...newUserData, email: text })}
                placeholder="Email Address"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.email}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="phone" size={20} color="#4c669f" style={styles.icon} />
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={newUserData.phone}
                onChangeText={(text) => setNewUserData({ ...newUserData, phone: text })}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.phone}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="location-on" size={20} color="#4c669f" style={styles.icon} />
            <Text style={styles.fieldLabel}>Address</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={newUserData.address}
                onChangeText={(text) => setNewUserData({ ...newUserData, address: text })}
                placeholder="Address"
              />
            ) : (
              <Text style={styles.fieldValue}>{userProfile.address}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {editMode ? (
              <Button title="Save Changes" onPress={handleSaveProfile} />
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.viewAppointmentButton} onPress={handleViewAppointment}>
            <Text style={styles.historyButtonText}>View Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>Profile data not available.</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4c669f',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    padding: 10,
    backgroundColor: '#36e6f7',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  viewAppointmentButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#4c669f',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
