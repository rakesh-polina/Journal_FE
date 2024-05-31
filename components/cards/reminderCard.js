import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../../styles/theme'

const ReminderCard = ({ reminder, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.editableArea} onPress={() => onEdit(reminder)}>
        <View style={styles.header}>
          <Text style={styles.date}>
            {new Date(reminder.triggerDate).toLocaleString('en-GB', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <Text style={styles.note} numberOfLines={2} ellipsizeMode='tail'>
          {reminder.note}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(reminder._id)}>
        <Image source={require('../../assets/icons/trash.png')} style={{width: 15, height: 20, tintColor:theme.error}}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.greyLight, // Adjust the color to match the image
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  editableArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: theme.secondaryText, // Adjust the color to match the image
    fontSize: 16, // Adjust the size to match the image
  },
  note: {
    color: theme.primaryText, // Adjust the color to match the image
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
