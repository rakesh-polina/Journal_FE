import React, { useState, useEffect, useCallback }  from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../src/config';
import axios from 'axios';
import theme from '../../styles/theme';
import storage from '../../src/storage';



function CreateEvent({ route, navigation }) {
  const { email, curlocation, event } = route.params || {}; // Get email and event from route params
  const [selectedMood, setSelectedMood] = useState(event ? event.mood : 2);
  const [title, setTitle] = useState(event ? event.title : '');
  const [note, setNote] = useState(event ? event.note : '');
  const [location, setLocation] = useState(event ? event.location : '' );
  const [bookmark, setBookmark] = useState(event ? event.bookmark : false);

  const [editing, setEditing] = useState(event? true : false);
  

  const mood = [
    { source: require('../../assets/icons/angry.png'), selectedColor: theme.error }, // Red
    { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning }, // Green
    { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary }, // Blue
    { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' }, // Yellow
    { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' }, // Magenta
  ];
  
  // Define your onPress functions
  const openCamera = () => {
    console.log(route.params);
  };
  const openGallery = () => {
    console.log('openGallery');
  };
  const openAudio = () => {
    console.log('openAudio');
  };
  const openLocation = () => {
    navigation.navigate('Location',{ location, event });
    console.log('openLocation');
  };
  const openFiles = () => {
    console.log('openFiles');
  };
  
  const addOns = [
    { src: require('../../assets/icons/camera3.png'), onPress: openCamera },
    { src: require('../../assets/icons/gallery.png'), onPress: openGallery },
    { src: require('../../assets/icons/audio2.png'), onPress: openAudio },
    { src: require('../../assets/icons/location2.png'), onPress: openLocation },
    { src: require('../../assets/icons/file3.png'), onPress: openFiles },
  ];

  const handleSave = async () => {
    // setIsPressed(true);
    const currentDate = new Date();
    // Construct the date in UTC time
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;
    const eventData = { title, mood: selectedMood, note, date: formattedDate, email, bookmark, location };

    try {
      if (editing) {
        setEditing(false);
        console.log(eventData)
        await axios.put(API_ENDPOINTS.UPDATE_EVENT(event._id), eventData);
      } else {
        await axios.post(API_ENDPOINTS.CREATE_EVENT, eventData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleSelectMood = (index) => {
    setSelectedMood(index);
  };

  const handleIconPress = (onPress) => {
    onPress(); // Call the respective onPress function
  };

  
  useEffect(() => {
    if (route.params && route.params.location) {
      setLocation(route.params.location);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.moodContainer}>
              {mood.map((mood, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelectMood(index)}>
                  <Image
                    source={mood.source}
                    style={[styles.mood, selectedMood === index && { tintColor: mood.selectedColor }]}
                  />
                </TouchableOpacity>
              ))}
          </View>
          <TextInput
            style={[styles.notesInput, {height: 60}]}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          <TextInput
            style={styles.notesInput}
            placeholder="Journal starts here..."
            value={note}
            onChangeText={setNote}
            multiline
          />
          <Text>{location}</Text>
          <View style={styles.iconContainer}>
            {addOns.map((addOn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleIconPress(addOn.onPress)}
                style={styles.iconButton}
              >
                <Image
                  source={addOn.src}
                  style={styles.icon}
                />
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </ScrollView>
        <View style={styles.setButtonContainer}>
          <TouchableOpacity style={styles.setButton} onPress={handleSave}>
            <Text style={styles.setButtonText}>{editing ? 'UPDATE EVENT' : 'SAVE'}</Text>
          </TouchableOpacity>

        </View>
    </SafeAreaView>
  );
}

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
    justifyContent: 'flex-start',
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
  setButtonContainer:{
    padding: 20,
    alignItems: 'center',
    paddingBottom: 10, 
  },
  setButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
    width: 250,
    elevation: 3,
  },
  setButtonText: {
    fontSize: 22,
    color: '#ffffff',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mood: {
    width: 35,
    height: 35,
    tintColor: theme.greyMedium,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
});


export default CreateEvent;
