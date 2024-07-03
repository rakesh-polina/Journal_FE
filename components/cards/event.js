import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../../styles/theme'

const Event = ({ event, onEdit, onDelete }) => {
  const getMoodDetails = (moodIndex) => {
    const moodDetails = [
      { source: require('../../assets/icons/angry.png'), selectedColor: theme.error }, // Red
      { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning }, // Green
      { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary }, // Blue
      { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' }, // Yellow
      { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' }, // Magenta
    ];

    return moodDetails[moodIndex] || moodDetails[0]; // Default to first mood if index is out of range
  };

  const { source, selectedColor } = getMoodDetails(event.mood);

  return (
    <View style={styles.card}>
      {event.bookmark? <Image source={require('../../assets/icons/bookmark.png')} tintColor={theme.primary} style={styles.bookmark}/> : null}
      <TouchableOpacity style={styles.editableArea} onPress={() => onEdit(event)}>
        <Text style={styles.note} numberOfLines={2} ellipsizeMode='tail'>
          {event.title}
        </Text>
        <View style={styles.header}>
          <Text style={styles.location}>
            {event.location}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(event._id)}>
        <Image source={source} style={{width: 25, height: 25, tintColor:selectedColor}}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.greyLight, // Adjust the color to match the image
    padding: 5,
    paddingHorizontal: 10,
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
    // borderWidth: 1,
    // borderColor: '#000',
  },
  location: {
    color: theme.secondaryText, // Adjust the color to match the image
    fontSize: 12, // Adjust the size to match the image
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
  bookmark:{
    height: 20,
    width: 20,
    position: 'absolute',
    top: 0,
    right: 15,
  },
});

export default Event;
