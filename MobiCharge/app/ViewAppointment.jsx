import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Dimensions, ActivityIndicator, StatusBar, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');

const ViewAppointment = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.user_id);
        const response = await axios.get('http://192.168.1.77:5000/api/appointment/getAppointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => a.userId === userId);
  const categorizedAppointments = {
    pending: filteredAppointments.filter(a => a.status === 'Pending'),
    ongoing: filteredAppointments.filter(a => a.status.toLowerCase() === 'ongoing'),
    completed: filteredAppointments.filter(a => a.status === 'Completed'),
  };

  const getStatusColor = status => ({
    pending: '#f9a825',
    ongoing: '#1e88e5',
    completed: '#43a047',
  }[status.toLowerCase()] || '#757575');

  const getPaymentStatusColor = status => ({
    paid: '#43a047',
    pending: '#f9a825',
    failed: '#e53935',
  }[status?.toLowerCase() || ''] || '#757575');

  const getIconName = tab => ({
    pending: 'schedule',
    ongoing: 'event-busy',
    completed: 'history',
  }[tab] || 'schedule'); // Fallback to 'schedule' to avoid undefined

  const renderAppointment = appointment => (
    <View key={appointment.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{appointment.ownerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardDetails}>
        {[
          { icon: 'directions-car', text: appointment.carModel },
          { icon: 'confirmation-number', text: appointment.carNumber },
          { icon: 'location-on', text: appointment.location },
        ].map(({ icon, text }, index) => (
          <View key={index} style={styles.detailRow}>
            <Icon name={icon} size={16} color="#555" style={styles.detailIcon} />
            <Text style={styles.cardText}>{text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {appointment.status === 'Completed' && (
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() => {
              setSelectedAppointment(appointment);
              setModalVisible(true);
            }}
          >
            <Icon name="receipt" size={16} color="#fff" />
            <Text style={styles.buttonText}>Receipt</Text>
          </TouchableOpacity>
        )}
        {appointment.status.toLowerCase() === 'ongoing' && (
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => {
              setSelectedAppointment(appointment);
              setStatusModalVisible(true);
            }}
          >
            <Icon name="info" size={16} color="#fff" />
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1e3c" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity onPress={fetchAppointments}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        {['pending', 'ongoing', 'completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1b2d4f" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {categorizedAppointments[activeTab].length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name={getIconName(activeTab)} size={60} color="#ccc" />
              <Text style={styles.emptyText}>No {activeTab} appointments</Text>
            </View>
          ) : (
            categorizedAppointments[activeTab].map(renderAppointment)
          )}
        </ScrollView>
      )}

      {selectedAppointment && (
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.receiptContainer}>
                <View style={styles.letterHead}>
                  <Image source={require('../assets/mainLogo.png.jpeg')} style={styles.logoImage} />
                  <Text style={styles.companyName}>MobiCharge</Text>
                </View>
                <Text style={styles.receiptTitle}>RECEIPT</Text>
                <Text style={styles.receiptNumber}>MBC-{selectedAppointment.id.toString().padStart(4, '0')}</Text>
                <View style={styles.divider} />
                {[
                  { label: 'Owner', value: selectedAppointment.ownerName },
                  { label: 'Car Model', value: selectedAppointment.carModel },
                  { label: 'Car Number', value: selectedAppointment.carNumber },
                  { label: 'Location', value: selectedAppointment.location },
                  { label: 'Total Cost', value: `रु ${selectedAppointment.cost}` },
                ].map(({ label, value }, index) => (
                  <View key={index} style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>{label}:</Text>
                    <Text style={styles.receiptValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {selectedAppointment && (
        <Modal animationType="slide" transparent visible={statusModalVisible} onRequestClose={() => setStatusModalVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setStatusModalVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.statusModalContainer}>
                <View style={styles.statusModalHeader}>
                  <Text style={styles.statusModalTitle}>Appointment Details</Text>
                  <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                    <Icon name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.appointmentTitle}>{selectedAppointment.ownerName}</Text>
                <Text style={styles.appointmentSubtitle}>{selectedAppointment.carModel} • {selectedAppointment.carNumber}</Text>
                <View style={styles.divider} />
                {[
                  {
                    title: 'Service Details',
                    items: [
                      { icon: 'build', label: 'Service', value: selectedAppointment.serviceName || 'Not specified' },
                      { icon: 'person', label: 'Technician', value: selectedAppointment.technicianName || 'Not assigned' },
                      { icon: 'location-on', label: 'Location', value: selectedAppointment.location },
                    ],
                  },
                  {
                    title: 'Status Information',
                    items: [
                      { icon: 'access-time', label: 'Start Time', value: selectedAppointment.startTime || 'Not started' },
                      { icon: 'timer', label: 'Est. Completion', value: selectedAppointment.estimatedEndTime || 'N/A' },
                      { icon: 'battery-charging-full', label: 'Battery Level', value: selectedAppointment.batteryLevel || 'N/A' },
                    ],
                  },
                  {
                    title: 'Payment Information',
                    items: [
                      { icon: 'account-balance-wallet', label: 'Amount', value: `रु ${selectedAppointment.cost}` },
                    ],
                  },
                ].map(({ title, items }, index) => (
                  <View key={index}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    {items.map(({ icon, label, value }, i) => (
                      <View key={i} style={styles.detailItem}>
                        <Icon name={icon} size={20} color="#0f1e3c" style={styles.detailItemIcon} />
                        <Text style={styles.detailItemLabel}>{label}:</Text>
                        <Text style={styles.detailItemValue}>{value}</Text>
                      </View>
                    ))}
                    {title === 'Payment Information' && (
                      <View style={styles.paymentStatusContainer}>
                        <Text style={styles.paymentStatusLabel}>Status:</Text>
                        <View style={[styles.paymentStatusBadge, { backgroundColor: getPaymentStatusColor(selectedAppointment.paymentStatus) }]}>
                          <Text style={styles.paymentStatusText}>{selectedAppointment.paymentStatus || 'N/A'}</Text>
                        </View>
                      </View>
                    )}
                    <View style={styles.divider} />
                  </View>
                ))}
                <TouchableOpacity style={styles.refreshButton} onPress={fetchAppointments}>
                  <Icon name="refresh" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: 45 },
  header: { height: 60, backgroundColor: '#0f1e3c', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', marginTop: 10 },
  tab: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#f1f1f1' },
  activeTab: { backgroundColor: '#1b2d4f' },
  tabText: { color: '#555', fontSize: 16 },
  activeTabText: { color: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { fontSize: 16, color: '#555' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  scroll: { paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, margin: 10, padding: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { padding: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  cardDetails: { marginVertical: 5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailIcon: { marginRight: 10 },
  cardText: { fontSize: 14, color: '#555' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  receiptButton: { flexDirection: 'row', backgroundColor: '#1e88e5', padding: 8, borderRadius: 5, alignItems: 'center' },
  statusButton: { flexDirection: 'row', backgroundColor: '#0f1e3c', padding: 8, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 14, marginLeft: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, width: width - 40, maxHeight: height * 0.8, padding: 15 },
  receiptContainer: { padding: 10 },
  letterHead: { alignItems: 'center', marginBottom: 15 },
  logoImage: { width: 50, height: 50, borderRadius: 25 },
  companyName: { fontSize: 24, fontWeight: 'bold', color: '#0f1e3c' },
  receiptTitle: { fontSize: 22, fontWeight: 'bold', color: '#1b2d4f', textAlign: 'center' },
  receiptNumber: { fontSize: 16, color: '#0f1e3c', textAlign: 'center' },
  receiptRow: { flexDirection: 'row', marginBottom: 8 },
  receiptLabel: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  receiptValue: { fontSize: 16, flex: 2 },
  statusModalContainer: { padding: 5 },
  statusModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f1e3c' },
  appointmentTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  appointmentSubtitle: { fontSize: 16, color: '#555', marginVertical: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f1e3c', marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailItemIcon: { marginRight: 10 },
  detailItemLabel: { width: 100, fontSize: 14, color: '#555' },
  detailItemValue: { fontSize: 14, color: '#333', flex: 1 },
  paymentStatusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  paymentStatusLabel: { fontSize: 14, color: '#555', width: 100, marginLeft: 34 },
  paymentStatusBadge: { padding: 6, borderRadius: 12 },
  paymentStatusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  refreshButton: { flexDirection: 'row', backgroundColor: '#0f1e3c', padding: 8, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});

export default ViewAppointment;