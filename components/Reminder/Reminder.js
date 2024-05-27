import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Modal,
  TouchableOpacity
} from 'react-native';
import { API_ENDPOINTS } from '../../src/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ReminderCard from '../cards/reminderCard';
import Icon from 'react-native-vector-icons/Ionicons';

const Reminder = ({ route  }) => {
  const { username } = route.params;
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [note, setNote] = useState('');
  const [triggerDate, setTriggerDate] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
        const result = await axios.get(API_ENDPOINTS.REMINDERS(username));
        setReminders(result.data);
    };
    fetchReminders();
}, [username]);

useFocusEffect(
  useCallback(() => {
    fetchReminders(); // Fetch reminders when the screen is focused
  }, [])
);

const handleEdit = (reminder) => {
  setCurrentReminder(reminder);
  setNote(reminder.note);
  setTriggerDate(new Date(reminder.triggerDate).toISOString().slice(0, 16));
  setModalVisible(true);
};

const handleDelete = async (id) => {
  await axios.delete(API_ENDPOINTS.MODIFY_REMINDER(id));
  // setReminders(reminders.filter(reminder => reminder._id !== id));
  fetchReminders();
};

const handleSave = async () => {
  const currentDateTime = new Date(); // Get the current date and time
  const reminderData = { 
    setDate: currentDateTime, 
    triggerDate, 
    note 
  };
  try {
    await axios.put(API_ENDPOINTS.MODIFY_REMINDER(currentReminder._id), reminderData);
    setModalVisible(false);
    fetchReminders(); // Fetch updated reminders after successful update
  } catch (error) {
    console.error('Error updating reminder:', error);
    // Handle error (e.g., show error message to user)
  }
};

const fetchReminders = async () => {
  const result = await axios.get(API_ENDPOINTS.REMINDERS(username));
  setReminders(result.data);
};

const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
          {reminders.map(reminder => (
            <ReminderCard 
              key={reminder._id}
              reminder={reminder}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </View>
      </ScrollView>
        <View style={styles.addContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateReminder', { username })}>
        <Icon name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setCurrentReminder(null);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Note"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />
          <TextInput
            placeholder="Trigger Date"
            value={triggerDate}
            onChangeText={setTriggerDate}
            style={styles.input}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0e7ff', // Light version of the card color
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 100, // Add padding to ensure content is not hidden behind the button
  },
  addContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns the button at the bottom
    alignItems: 'center',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#1e3a8a', // Adjust the color to match the image
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // Adjust as needed
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Reminder;


