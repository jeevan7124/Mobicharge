import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const [notifs, setNotifs] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  // Book appointment and add notification
  const handleBooking = () => {
    router.push('/bookAppointment');
    console.log('Getting your booking page right awayyyyyyy!!!!!!<>');
    const newNotif = { id: Date.now(), message: 'Station Booked!', type: 'info' };
    setNotifs([...notifs, newNotif]);
  };

  // Remove notification
  const dismissNotification = (id) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  // Toggle notification panel
  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <LinearGradient colors={['#21929d', '#166d7a']} style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileIconBox}>
            <Image source={require('../assets/Jeevan.jpg')} style={styles.profileIcon} />
          </TouchableOpacity>
          <Text style={styles.subText}>Powering Your EV Journey in Nepal</Text>
        </LinearGradient>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <View style={styles.iconBg}>
              <Ionicons name='calendar-outline' size={30} color='#fff' />
            </View>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/track-vehicle')}>

          
            <View style={styles.iconBg}>
              <MaterialIcons name='gps-fixed' size={30} color='#fff' />
            </View>
            <Text style={styles.buttonText}>Track EV</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.services}>
          {[
            { icon: 'bolt', name: 'Fast Charge', type: 'FontAwesome' },
            { icon: 'support-agent', name: '24/7 Support', type: 'MaterialIcons' },
            { icon: 'location', name: 'On-Demand', type: 'Ionicons' },
          ].map((service, i) => (
            <View key={i} style={styles.serviceItem}>
              {service.type === 'FontAwesome' && <FontAwesome name={service.icon} size={40} color='#21929d' />}
              {service.type === 'MaterialIcons' && <MaterialIcons name={service.icon} size={40} color='#21929d' />}
              {service.type === 'Ionicons' && <Ionicons name={service.icon} size={40} color='#21929d' />}
              <Text style={styles.serviceText}>{service.name}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.aboutCard} onPress={() => router.push('/about-us')}>
          <View style={styles.aboutContent}>
            <Image source={require('../assets/mainLogo.png.jpeg')} style={styles.aboutLogo} />
            <View>
              <Text style={styles.aboutTitle}>About Us</Text>
              <Text style={styles.aboutText}>
                Nepal's first mobile EV charging app, bringing chargers to you!
              </Text>
            </View>
          </View>
          <View style={styles.learnMore}>
            <Text style={styles.learnMoreText}>Learn More</Text>
            <Ionicons name='arrow-forward' size={16} color='#21929d' />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.websiteButton}
          onPress={() => Linking.openURL('http://192.168.1.77:3000')}
        >
          <Text style={styles.websiteButtonText}>Visit Website</Text>
          <Ionicons name='globe-outline' size={24} color='#fff' />
        </TouchableOpacity>

        <View style={styles.socialIcons}>
          {[
            { platform: 'facebook', url: 'https://facebook.com/mobicharge' },
            { platform: 'twitter', url: 'https://twitter.com/mobicharge' },
            { platform: 'instagram', url: 'https://instagram.com/mobicharge' },
          ].map((social, i) => (
            <TouchableOpacity key={i} style={styles.socialIcon} onPress={() => Linking.openURL(social.url)}>
              <FontAwesome name={social.platform} size={30} color='#21929d' />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 MobiCharge</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={togglePanel}>
        <Ionicons name='notifications' size={30} color='#fff' />
        {notifs.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifs.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {panelOpen && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Notifications</Text>
          {notifs.length === 0 ? (
            <Text style={styles.noNotifs}>No notifications</Text>
          ) : (
            notifs.map(notif => (
              <View key={notif.id} style={styles.notifItem}>
                <Text
                  style={[styles.notifText, { color: notif.type === 'success' ? '#28a745' : '#21929d' }]}
                >
                  {notif.message}
                </Text>
                <TouchableOpacity onPress={() => dismissNotification(notif.id)}>
                  <Ionicons name='close' size={20} color='#555' />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
  content: { alignItems: 'center', paddingBottom: height * 0.1 },
  header: {
    width: width,
    paddingVertical: height * 0.08,
    marginTop: 55,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  subText: { fontSize: 16, color: '#f0f0f0', textAlign: 'center', marginTop: 10 },
  profileIconBox: {
    position: 'absolute',
    top: height * 0.04,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
    elevation: 3,
  },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: height * 0.04,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21929d',
    padding: 12,
    borderRadius: 15,
    width: width * 0.42,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  iconBg: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
  services: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: height * 0.04,
  },
  serviceItem: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    width: width * 0.28,
    elevation: 2,
  },
  serviceText: { fontSize: 14, color: '#333', marginTop: 8, textAlign: 'center' },
  aboutCard: {
    width: '90%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    marginBottom: height * 0.03,
  },
  aboutContent: { flexDirection: 'row', alignItems: 'center' },
  aboutLogo: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  aboutTitle: { fontSize: 18, fontWeight: '600', color: '#21929d',paddingLeft:10 },
  aboutText: { fontSize: 14, color: '#555', marginTop: 4, paddingLeft:10 },
  learnMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  learnMoreText: { fontSize: 14, color: '#21929d', fontWeight: '600', marginRight: 5 },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21929d',
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    marginVertical: height * 0.03,
  },
  websiteButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginRight: 10 },
  socialIcons: { flexDirection: 'row', gap: 20, marginBottom: height * 0.04 },
  socialIcon: { padding: 12, backgroundColor: '#f8f8f8', borderRadius: 30, elevation: 2 },
  footer: { width: width, padding: 15, backgroundColor: '#f8f8f8', alignItems: 'center' },
  footerText: { fontSize: 14, color: '#555' },
  floatingButton: {
    position: 'absolute',
    top: 90,
    left: 20,
    backgroundColor: '#21929d',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  panel: {
    position: 'absolute',
    top: 120,
    left: 20,
    width: width * 0.7,
    maxHeight: height * 0.3,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 4,
  },
  panelTitle: { fontSize: 18, fontWeight: '600', color: '#21929d', marginBottom: 10, },
  noNotifs: { fontSize: 14, color: '#555', textAlign: 'center' },
  notifItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  notifText: { fontSize: 14, flex: 1 },
});

export default Home;