import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';
import { API_ENDPOINTS } from '../../src/config';
import CustomCalendar from './CustomCalendar'; // Adjust the path as necessary

const CreateReminder = ({ route, navigation }) => {
  const { username } = route.params; // Get username from route params
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const handleSave = async () => {
    const currentDateTime = new Date(); // Get the current date and time
    const triggerDate = `${selectedDate} ${selectedTime}`;
    const reminderData = { username, setDate: currentDateTime, triggerDate, note };

    try {
      await axios.post(API_ENDPOINTS.REMINDER, { ...reminderData });
      navigation.goBack(); // Navigate back after successful creation
    } catch (error) {
      console.error('Error creating reminder:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDatePicked = (date) => {
    setSelectedTime(moment(date).format('HH:mm'));
    setIsDateTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Remainders</Text>
      <CustomCalendar onDateSelected={setSelectedDate} />
      <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.timeText}>{selectedTime ? selectedTime : 'Select Time'}</Text>
        </View>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        mode="time"
        onConfirm={handleDatePicked}
        onCancel={() => setIsDateTimePickerVisible(false)}
      />
      <TextInput
        style={styles.notesInput}
        placeholder="Remind yourself..."
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity style={styles.setButton} onPress={handleSave}>
        <Text style={styles.setButtonText}>SET REMINDER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3c7f9', // Light version of the card color
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateTimeContainer: {
    backgroundColor: '#1e3a8a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 10,
  },
  notesInput: {
    backgroundColor: '#3b5998',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 18,
  },
  setButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  setButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default CreateReminder;