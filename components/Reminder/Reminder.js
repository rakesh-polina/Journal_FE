import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { API_ENDPOINTS } from '../../src/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ReminderCard from '../cards/reminderCard';
import Icon from 'react-native-vector-icons/Ionicons';

const Reminder = ({ route }) => {
  const { email } = route.params;
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();

  const fetchReminders = async () => {
    const result = await axios.get(API_ENDPOINTS.REMINDERS(email));
    setReminders(result.data);
  };

  useEffect(() => {
    fetchReminders();
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      fetchReminders(); // Fetch reminders when the screen is focused
    }, [])
  );

  const handleEdit = (reminder) => {
    navigation.navigate('CreateReminder', { 
      email, 
      reminder 
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(API_ENDPOINTS.MODIFY_REMINDER(id));
    fetchReminders();
  };

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
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('CreateReminder', { email })}
        >
          <Icon name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0e7ff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  addContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1e3a8a',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default Reminder;