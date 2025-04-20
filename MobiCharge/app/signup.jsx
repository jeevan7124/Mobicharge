import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, 
  KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [success, setSuccess] = useState('');
  

  const router = useRouter();

  const phonePattern = /^[0-9]{10}$/;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Function to handle registration
  const handleRegister = async () => {
    Keyboard.dismiss(); // Hide keyboard when the user submits the form

    console.log('Sending registration data:', { fullName, address, phone, email, password });

    // Trim any extra spaces from the fields
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();

    // Check if any of the fields are empty
    if (!trimmedFullName || !trimmedAddress || !phone || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Validate phone number format (must be 10 digits)
    if (!phonePattern.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate email format
    if (!emailPattern.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear any previous error message if all checks are passed
    setError('');

    try {
      // Make the API request to register the user
      const response = await axios.post('http://192.168.1.77:5000/api/auth/register', {
        fullName: trimmedFullName, 
        address: trimmedAddress, 
        phone, 
        email: trimmedEmail, 
        password,
      });

      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        setSuccess('Registration successful! Please log in.');
      
        setTimeout(() => {
          router.push('/login');
        }, 1500); // 1.5-second delay to show the success message
      }
      
    } catch (err) {
      // If there's an error, show an error message
      console.error('Registration Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Registration failed. Please try again.');
    }
    {success ? <Text style={{ color: 'green', marginBottom: 15, textAlign: 'center' }}>{success}</Text> : null}

  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Create Account</Text>
        {/* Show error message if any */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
  <Text style={{ color: 'green', marginBottom: 15, textAlign: 'center' }}>
    {success}
  </Text>
) : null}

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="location-on" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons 
              name={passwordVisible ? "visibility" : "visibility-off"} 
              size={24} 
              color="gray" 
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <MaterialIcons 
              name={confirmPasswordVisible ? "visibility" : "visibility-off"} 
              size={24} 
              color="gray" 
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        

        {/* Link to login page if the user already has an account */}
        <Text style={styles.loginText} onPress={() => router.push('/login')}>
          Already have an account? Log in here.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f5f6', // lighter teal background
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1b6e75',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: '#e63946',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1b6e75',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#1b6e75',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    marginTop: 25,
    color: '#1b6e75',
    textAlign: 'center',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default Signup;
