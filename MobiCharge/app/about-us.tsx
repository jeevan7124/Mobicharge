import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Get screen dimensions
const { width } = Dimensions.get("window");

const AboutUs = () => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#21929d" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image
          source={require('../assets/mainLogo.png.jpeg')}
          style={styles.logo}
        />

        {/* About Us heading */}
        <Text style={styles.title}>About MobiCharge</Text>

        {/* Company description */}
        <Text style={styles.description}>
          MobiCharge is Nepal's first mobile EV charging app, designed to provide
          convenient, on-the-go charging solutions for electric vehicle owners.
          Unlike traditional charging stations, MobiCharge brings the charger to
          you, wherever you are, using GPS-based tracking.
        </Text>

        <Text style={styles.description}>
          Our innovative approach ensures that EV users never have to worry about 
          finding a charging station when they need one the most. The goal of 
          MobiCharge is to revolutionize the way electric vehicle charging works 
          in Nepal by providing a flexible, efficient, and customer-friendly 
          charging experience.
        </Text>

        {/* Our Mission section */}
        <Text style={styles.sectionTitle}>Our Mission</Text>

        <View style={styles.missionBox}>
          <Text style={styles.missionText}>
            To eliminate range anxiety for electric vehicle owners in Nepal through
            innovative mobile charging solutions that are accessible anytime, anywhere.
          </Text>
        </View>

        {/* Meet the Team section */}
        <Text style={styles.sectionTitle}>Meet the Team</Text>

        {/* Founder information */}
        <View style={styles.teamMember}>
          <Image 
            source={require('../assets/Jeevan.jpg')} 
            style={styles.memberImage} 
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Jeevan Khatiwada</Text>
            <Text style={styles.memberRole}>Founder</Text>
            <Text style={styles.memberDescription}>
              Seeing the growing problem of electric vehicle charging in Nepal, I
              came up with the idea of MobiCharge as my Final Year Project (FYP) in
              college. My vision was to create a seamless mobile charging solution
              that eliminates range anxiety for EV owners.
            </Text>
          </View>
        </View>

        {/* Key Features section */}
        <Text style={styles.sectionTitle}>Key Features</Text>

        <View style={styles.featureItem}>
          <Ionicons name="location" size={24} color="#21929d" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>GPS Tracking</Text>
            <Text style={styles.featureDescription}>
              Locate your vehicle and the nearest charging unit in real-time
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="calendar-outline" size={24} color="#21929d" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Easy Booking</Text>
            <Text style={styles.featureDescription}>
              Schedule charging sessions with just a few taps
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="flash" size={24} color="#21929d" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Fast Charging</Text>
            <Text style={styles.featureDescription}>
              Get back on the road quickly with our rapid charging technology
            </Text>
          </View>
        </View>

        {/* Copyright footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 MobiCharge</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 90,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#21929d',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#21929d',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
    width: width * 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21929d',
    marginTop: 25,
    marginBottom: 15,
    alignSelf: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#21929d',
    paddingBottom: 5,
    width: width * 0.9,
  },
  missionBox: {
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#21929d',
    width: width * 0.9,
  },
  missionText: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  teamMember: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: width * 0.9,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#21929d',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#21929d',
    marginBottom: 8,
    fontWeight: '500',
  },
  memberDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: width * 0.9,
  },
  featureContent: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    marginTop: 30,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: width * 0.9,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});

export default AboutUs;