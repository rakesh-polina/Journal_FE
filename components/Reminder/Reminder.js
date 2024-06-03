import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { API_ENDPOINTS } from '../../src/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ReminderCard from '../cards/reminderCard';
import theme from '../../styles/theme';

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
          //   <Swipeable
          //   key={reminder._id}
          //   renderRightActions={(progress, dragX) => {
          //     const translateX = dragX.interpolate({
          //       inputRange: [0, 100],
          //       outputRange: [0, 100],
          //     });
          //     return (
          //       <View style={{ flexDirection: 'row' }}>
          //         <TouchableOpacity
          //           style={[styles.actionButton, { backgroundColor: 'blue' }]}
          //           onPress={() => handleEdit(reminder)}
          //         >
          //           <Text style={styles.actionText}>Edit</Text>
          //         </TouchableOpacity>
          //         <TouchableOpacity
          //           style={[styles.actionButton, { backgroundColor: 'red' }]}
          //           onPress={() => handleDelete(reminder)}
          //         >
          //           <Text style={styles.actionText}>Delete</Text>
          //         </TouchableOpacity>
          //       </View>
          //     );
          //   }}
          //   useNativeAnimations
          // >
            <ReminderCard 
              key={reminder._id}
              reminder={reminder}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            // </Swipeable>
          ))}
        </View>
      </ScrollView>
      <View style={styles.addContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('CreateReminder', { email })}
        >
          <Image source={require('../../assets/icons/plus.png')} style={{tintColor:'#fff'}}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: theme.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    elevation: 7,
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default Reminder;