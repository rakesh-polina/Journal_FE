import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { API_ENDPOINTS } from '../../src/config';
import CustomCalendar from './CustomCalendar'; 
import WheelTimePicker from './WheelTimePicker';
import theme from '../../styles/theme';

const CreateReminder = ({ route, navigation }) => {
  const { email, reminder } = route.params || {}; // Get email and reminder from route params
  const [note, setNote] = useState(reminder ? reminder.note : '');
  const [selectedDate, setSelectedDate] = useState(reminder ? moment(reminder.triggerDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState(reminder ? moment(reminder.triggerDate).format('HH:mm') : moment().format('HH:mm'));
  const [isPressed, setIsPressed] = useState(false);

  const handleSave = async () => {
    if (note.trim() === '') {
      Alert.alert('Empty Note', 'Please enter a note for the reminder.');
      return;
    }
    setIsPressed(true);
    const currentDateTime = moment();
    const formattedTime = moment(selectedTime, 'HH:mm:ss.SSSZ').format('HH:mm');
    const triggerDate = moment(`${selectedDate} ${formattedTime}`, 'YYYY-MM-DD HH:mm');
    if (triggerDate.isBefore(currentDateTime)) {
      Alert.alert('Invalid Date/Time', 'You cannot set a reminder in the past.');
      setIsPressed(false);
      return;
    }

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
          <TextInput
            style={styles.notesInput}
            placeholder="Remind yourself..."
            value={note}
            onChangeText={setNote}
            multiline
          />
          <CustomCalendar onDateSelected={setSelectedDate} initialDate={selectedDate} />
          <View style={styles.timePickerContainer}>
            <WheelTimePicker onSnappedTime={handleSnappedTime} initialTime={selectedTime} />
          </View>
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  timePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  notesInput: {
    backgroundColor: theme.greyLight,
    elevation: 3,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    color: theme.primaryText,
    fontSize: 18,
    height: 90,
    textAlignVertical: 'top',
  },
  setButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
  },
  setButtonDisabled: {
    backgroundColor: theme.primaryLight, // Use a lighter color to indicate disabled state
  },
  setButtonText: {
    fontSize: 22,
    color: '#ffffff',
  },
});

export default CreateReminder;