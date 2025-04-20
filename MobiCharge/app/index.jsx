import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router'; // For navigation
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const Index = () => {
  const router = useRouter();

  // Simple animation for logo
  const [logoFade] = useState(new Animated.Value(0));
  
  // Simple animation for button
  const [buttonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    // Simple fade in animation for logo
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Simple button press effect
  const handleButtonPress = () => {
    // Make button smaller
    Animated.timing(buttonScale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Then make it normal size again
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
         // Log to console
    console.log('Button CLICKED!!!!!Redirecting to Login From Index Page...');
      
      // Navigate to login page
      router.push('/login');
    });
  };

  return (
    <View style={styles.container}>
      {/* App logo with fade in effect */}
      <Animated.Image
        source={require('../assets/mainLogo.png.jpeg')}
        style={[styles.logo, { opacity: logoFade }]}
      />

      {/* App name */}
      <Text style={styles.appName}>MobiCharge</Text>
      
      {/* Welcome message */}
      <Text style={styles.welcomeText}>Charge your vehicle anywhere</Text>

      {/* Features section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureBox}>
          <MaterialIcons name="battery-charging-full" size={40} color="white" />
          <Text style={styles.featureText}>Fast Charging</Text>
        </View>

        <View style={styles.featureBox}>
          <MaterialIcons name="power" size={40} color="white" />
          <Text style={styles.featureText}>Easy Connect</Text>
        </View>
      </View>

      {/* Button with simple animation */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPress}
        >
          <Text style={styles.buttonText}>Start Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#21929d',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  featureBox: {
    backgroundColor: '#21929d',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
  },
  featureText: {
    color: 'white',
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#21929d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;