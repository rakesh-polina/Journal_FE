import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  Image,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Modal,
  PermissionsAndroid, 
  Platform,
} from 'react-native';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../src/config';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';
import theme from '../../styles/theme';
import { fetchMedia, clusterByDateAndLocation } from './FetchMedia'; // Make sure to import the helper functions
import { parseISO, format, isValid, parse } from 'date-fns';
import storage from '../../src/storage';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    console.log("It is android")
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to fetch recent activities.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      console.log('Permission status:', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const RecommendationsTab = ({ clusters }) => (
  <FlatList
    data={clusters}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text>
          {item.date && isValid(parseISO(item.date))
            ? format(parseISO(item.date), 'PP')
            : 'No date available'}
        </Text>
        <Text>
          Location: (
          {item.location && item.location.latitude ? item.location.latitude : 'N/A'}
          , 
          {item.location && item.location.longitude ? item.location.longitude : 'N/A'}
          )
        </Text>
        <FlatList
          data={item.items}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={{ height: 100, width: 100 }} />
          )}
          horizontal
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )}
    keyExtractor={(item, index) => index.toString()}
  />
);

function CreateEvent({ route, navigation }) {
  
  const { email, curlocation, event } = route.params || {}; // Get email and event from route params
  const [selectedMood, setSelectedMood] = useState(event ? event.mood : 2);
  const [title, setTitle] = useState(event ? event.title : '');
  const [note, setNote] = useState(event ? event.note : '');
  const [location, setLocation] = useState(event ? event.location : '' );
  const [bookmark, setBookmark] = useState(event ? event.bookmark : false);
  
  const [editing, setEditing] = useState(event? true : false);
  
  const audioRecorderPlayer = new AudioRecorderPlayer()
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  
  

  const mood = [
    { source: require('../../assets/icons/angry.png'), selectedColor: theme.error }, // Red
    { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning }, // Green
    { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary }, // Blue
    { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' }, // Yellow
    { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' }, // Magenta
  ];
  
  // ATTACHMENTS FUNCTIONS
  const openCamera = () => {
    console.log(route.params);
  };

  const openGallery = () => {
    console.log('openGallery');
  };

  const openAudio = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };  

  const openLocation = () => {
    navigation.navigate('Location',{ location, event });
    console.log('openLocation');
  };

  const openFiles = () => {
    console.log('openFiles');
  };


  //AUDIO AND STORAGE PERMISSIONS REQUEST
  const requestAudioPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
  
        if (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the audio and storage');
        } else {
          console.log('Permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        if (result === RESULTS.GRANTED) {
          console.log('You can use the microphone');
        } else {
          console.log('Permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  
  useEffect(() => {
    requestAudioPermissions();
  }, []);

  //AUDIO RECORDING FUNCTIONS

  const startRecording = async () => {
    const granted = await requestAudioPermissions();
    if (!granted) {
      console.warn('Permissions not granted');
      return;
    }

    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });

    setRecording(true);
    const result = await audioRecorderPlayer.startRecorder(path);
    setCurrentRecording(result);
  };
  
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecordings([...recordings, { path: result }]);
      setRecording(false);
      setCurrentRecording(null);
      console.log(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const deleteRecording = (index) => {
    const newRecordings = [...recordings];
    newRecordings.splice(index, 1);
    setRecordings(newRecordings);
  };

  const playRecording = async (path) => {
    await audioRecorderPlayer.startPlayer(path);
    await audioRecorderPlayer.setVolume(1.0);
  };
  
  const addOns = [
    { id: 'camera', src: require('../../assets/icons/camera3.png'), onPress: openCamera },
    { id: 'gallery', src: require('../../assets/icons/gallery.png'), onPress: openGallery },
    { id: 'audio', src: require('../../assets/icons/audio2.png'), onPress: openAudio },
    { id: 'location', src: require('../../assets/icons/location2.png'), onPress: openLocation },
    { id: 'file', src: require('../../assets/icons/file3.png'), onPress: openFiles },
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

  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
  };

  useEffect(() => {
    const loadMedia = async () => {
      console.log('Requesting storage permission');
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log('Permission denied');
        return;
      }
      console.log('Fetching media');
      const items = await fetchMedia();
      console.log('Fetched items:', items);
      const clustered = clusterByDateAndLocation(items, 1); // 1 km max distance for clustering
      console.log('Clustered items:', clustered);
      setClusters(clustered);
      setLoading(false);
    };

    loadMedia();
  }, []);

  
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
            style={[styles.notesInput, { height: 60 }]}
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
          <View>
            {recordings.map((recording, index) => (
              <View key={index} style={styles.recordingContainer}>
                <Text>{`Recording ${index + 1}`}</Text>
                <TouchableOpacity onPress={() => playRecording(recording.path)}>
                  <Text style={styles.playButton}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecording(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.iconContainer}>
            {addOns.map((addOn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleIconPress(addOn.onPress)}
                style={[
                  styles.iconButton,
                  addOn.id === 'audio' && (recording ? styles.audioIconButtonRecording : styles.iconButton),
                ]}
              >
                <Image
                  source={addOn.src}
                  style={[
                    styles.icon,
                    addOn.id === 'audio' && (recording ? styles.audioIconRecording : styles.icon),
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={toggleRecommendations} style={styles.recommendationsButton}>
            <Text style={styles.recommendationsButtonText}>Show Recommendations</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color={theme.primary} />}
          
        </View>
      </ScrollView>
      <View style={styles.setButtonContainer}>
        <TouchableOpacity style={styles.setButton} onPress={handleSave}>
          <Text style={styles.setButtonText}>{editing ? 'UPDATE EVENT' : 'SAVE'}</Text>
        </TouchableOpacity>
      </View>
      {showRecommendations && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRecommendations}
          onRequestClose={toggleRecommendations}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={toggleRecommendations} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <RecommendationsTab clusters={clusters} />
            </View>
          </View>
        </Modal>
      )}
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
  setButtonContainer: {
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
    // backgroundColor: theme.primary,
    borderRadius: 25,
    padding: 10,
  },
  //recording icon button
  audioIconButtonRecording: {
    backgroundColor: theme.primary,
    borderRadius: 25,
    padding: 10,
  },
  audioIconRecording: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
  recordingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationsButton: {
    backgroundColor: theme.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  recommendationsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '50%',
  },
  closeButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: theme.primary,
    fontSize: 16,
  },
  card: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
});

export default CreateEvent;