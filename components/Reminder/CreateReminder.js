import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { API_ENDPOINTS } from '../../src/config';
import CustomCalendar from './CustomCalendar'; 
import WheelTimePicker from './WheelTimePicker';

const CreateReminder = ({ route, navigation }) => {
  const { email, reminder } = route.params || {}; // Get email and reminder from route params
  const [note, setNote] = useState(reminder ? reminder.note : '');
  const [selectedDate, setSelectedDate] = useState(reminder ? moment(reminder.triggerDate).format('YYYY-MM-DD') : '');
  const [selectedTime, setSelectedTime] = useState(reminder ? moment(reminder.triggerDate).format('HH:mm') : '');

  const handleSave = async () => {
    const currentDateTime = new Date();
    const formattedTime = moment(selectedTime, 'HH:mm:ss.SSSZ').format('HH:mm');
    const triggerDate = moment(`${selectedDate} ${formattedTime}`, 'YYYY-MM-DD HH:mm').toISOString();
    const reminderData = { email, setDate: currentDateTime, triggerDate, note };

    try {
      if (reminder) {
        await axios.put(API_ENDPOINTS.MODIFY_REMINDER(reminder._id), reminderData);
      } else {
        await axios.post(API_ENDPOINTS.REMINDER, reminderData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleSnappedTime = (snappedTime) => {
    setSelectedTime(snappedTime);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Reminders</Text>
          <CustomCalendar onDateSelected={setSelectedDate} initialDate={selectedDate} />
          <View style={styles.timePickerContainer}>
            <WheelTimePicker onSnappedTime={handleSnappedTime} initialTime={selectedTime} />
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Remind yourself..."
            value={note}
            onChangeText={setNote}
            multiline
          />
          <TouchableOpacity style={styles.setButton} onPress={handleSave}>
            <Text style={styles.setButtonText}>{reminder ? 'UPDATE REMINDER' : 'SET REMINDER'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0e7ff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#b3c7f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
