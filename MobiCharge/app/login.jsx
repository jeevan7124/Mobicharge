import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      // Admin login check
      if (email === 'mobicharge@admin.com' && password === 'mobicharge') {
        await AsyncStorage.setItem('userToken', 'admin-token-placeholder');
        await AsyncStorage.setItem('isAdmin', 'true');
        await AsyncStorage.setItem('userEmail', email);
        
        router.replace('admin-home');
        return;
      }
  
      // Regular user login
      const response = await axios.post('http://192.168.1.77:5000/api/auth/login', {
        email,
        password,
      });
  
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('isAdmin', 'false');
      
      setSuccess('Login successful!');
      setTimeout(() => {
        router.replace('home');
      }, 1000); // 1 second delay
      console.log('Button CLICKED!!!!!LESS GO LOGIN SUCESSFULLLLL');

      
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Authentication failed');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image source={require('../assets/mainLogo.png.jpeg')} style={styles.logo} />
        
        <Text style={styles.header}>Welcome Back</Text>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
        {success ? (
          <View style={styles.successContainer}>
           <Text style={styles.success}>{success}</Text>
           </View>
        ) : null}


        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={22} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={22} color="#21929d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <MaterialIcons 
              name={showPassword ? "visibility" : "visibility-off"} 
              size={22} 
              color="#999" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text
          style={styles.signupText}
          onPress={() => router.replace('signup')}
        >
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    backgroundColor: '#E6F4EA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  success: {
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#21929d',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#21929d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: '#89c5cc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  signupLink: {
    color: '#21929d',
    fontWeight: 'bold',
  }
  
});

export default Login;