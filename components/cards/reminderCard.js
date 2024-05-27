// reminderCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Use the appropriate icon set

const ReminderCard = ({ reminder, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{new Date(reminder.triggerDate).toLocaleString('en-GB', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</Text>
      </View>
      <Text style={styles.note} numberOfLines={2} ellipsizeMode='tail'>{reminder.note}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(reminder)}>
          <Icon name="pencil" size={24} color="#ffffff" />
        </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(reminder._id)}>
        <Icon name="trash" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e3a8a', // Adjust the color to match the image
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#ffffff', // Adjust the color to match the image
    fontSize: 16, // Adjust the size to match the image
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  note: {
    color: '#ffffff', // Adjust the color to match the image
    fontSize: 24, // Adjust the size to match the image
    marginVertical: 10,
    paddingRight: 50,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default ReminderCard;
