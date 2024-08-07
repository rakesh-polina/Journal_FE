import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  PermissionsAndroid, 
  Platform,
  Button,
} from 'react-native';
import theme from '../../styles/theme';

import { useDispatch, useSelector } from 'react-redux';
import { setEventState, resetEventState } from '../../src/slices/eventSlice';
import { API_ENDPOINTS } from '../../src/config';
import axios from 'axios';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { fetchMedia, clusterByDateAndLocation } from './FetchMedia'; // Make sure to import the helper functions
import { parseISO, format, isValid } from 'date-fns';
import MediaDisplay from './MediaDisplay';
import DocDisplay from './DocDisplay';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import AudioPlayer from './AudioPlayer'; // Adjust the path as needed

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    // console.log("It is android")
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
  const dispatch = useDispatch();
  const eventState = useSelector((state) => state.event);

  const { email, event, formattedDate } = route.params || {}; // Get email and event from route params
  
  const {
    selectedMood,
    title,
    note,
    location,
    bookmark,
    selectedMedia,
    selectedDocs,
    recordedAudio,
    editing,
  } = eventState;
  
  useEffect(() => {
    if (route.params && route.params.event) {
      dispatch(setEventState(route.params.event));
      dispatch(setEventState({ editing: true }));
      console.log(route.params.event);
    }
  }, [route.params, dispatch]);

  // const [selectedMood, setSelectedMood] = useState(event ? event.mood : 2);
  // const [title, setTitle] = useState(event ? event.title : '');
  // const [note, setNote] = useState(event ? event.note : '');
  // const [location, setLocation] = useState(event ? event.location : '' );
  // const [bookmark, setBookmark] = useState(event ? event.bookmark : false);
  // const [selectedMedia, setSelectedMedia] = useState(event ? [...event.media.image, ...event.media.video] : []);
  // const [selectedDocs, setSelectedDocs] = useState(event ? event.media.documents : []);
  // const [recordedAudio, setRecordedAudio] = useState(event && event.media.voice.length > 0 ? event.media.voice[0] : null);
  
  // const [editing, setEditing] = useState(event? true : false);

  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  // console.log(selectedMedia);
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [isRecording, setIsRecording] = useState(false);
  // const [currentPositionSec, setCurrentPositionSec] = useState(0);
  // const [currentDurationSec, setCurrentDurationSec] = useState(0);
  // const [playTime, setPlayTime] = useState('00:00:00');
  // const [duration, setDuration] = useState('00:00:00');

   
  const mood = [
    { source: require('../../assets/icons/angry.png'), selectedColor: theme.error }, // Red
    { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning }, // Green
    { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary }, // Blue
    { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' }, // Yellow
    { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' }, // Magenta
  ];
  
  // ATTACHMENTS FUNCTIONS
  const openCamera = () => {

    const options = {
      mediaType: 'photo', // You can change to 'video' if needed
      includeBase64: false,
    };
  
    launchCamera(options, (response) => {
      // const selectedMedia = useSelector((state) => state.event.selectedMedia);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const newMedia = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
        };
        // setSelectedMedia((prevMedia) => [...prevMedia, newMedia]);
        console.log('hi',selectedMedia);
        dispatch(setEventState({ selectedMedia: [...selectedMedia, newMedia] }));
        console.log('hello',selectedMedia);
      }
    });
  };
  

  const openGallery = () => {
    const options = {
      mediaType: 'mixed',
      includeBase64: false,
      selectionLimit: 0,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const newMedia = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
        }));
        // setSelectedMedia((prevMedia) => [...prevMedia, ...newMedia]);
        dispatch(setEventState({ selectedMedia: [...selectedMedia, ...newMedia] }));
        // console.log(selectedMedia);
      }
    });
  };

  const openFiles = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], allowMultiSelection: true,
      });
      const uniqueResults = results.filter(newItem =>
        !selectedDocs.some(prevItem => prevItem.uri === newItem.uri)
      );
  
      dispatch(setEventState({ selectedDocs: [...selectedDocs, ...uniqueResults] }));
      // setSelectedDocs((prevDocs) => {
      //   const uniqueDocs = results.filter(newItem =>
      //     !prevDocs.some(prevItem => prevItem.uri === newItem.uri)
      //   );
      //   return [...prevDocs, ...uniqueDocs];
      // });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('DocumentPicker Error: ', err);
      }
    }
  };

  const onStartRecord = async () => {
    try {
      const dirs = RNFetchBlob.fs.dirs;
      const path = Platform.select({
        ios: `${dirs.DocumentDir}/hello.m4a`,
        android: `${dirs.CacheDir}/hello.mp3`,
      });

      const uri = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition);
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      console.log('Recording started at: ', uri);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      dispatch(setEventState({ recordedAudio: result }));
      // setRecordedAudio(result); // Store the recorded audio file's path
      setIsRecording(false);
      console.log('Recording stopped: ', result);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };
  
  const onDeleteRecordedAudio = () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    // setRecordedAudio(null); // Remove the recorded audio file from the state
    dispatch(setEventState({ recordedAudio: null }));
  };
  

  const openAudio = () => {
    console.log('openAudio');
    if (isRecording) {
      onStopRecord();
    } else {
      onStartRecord();
    }
    setIsRecording(!isRecording);
  };

  const openLocation = () => {
    dispatch(setEventState({
      selectedMood,
      title,
      note,
      location,
      bookmark,
      selectedMedia,
      selectedDocs,
      recordedAudio,
      editing,
    }));
    navigation.navigate('Location',{ location });
    console.log('openLocation');
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
    
          return (
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
          );
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        return result === RESULTS.GRANTED;
      }
      return true;
    };
  
  useEffect(() => {
    requestAudioPermissions();
  }, []);
  
  const addOns = [
    { id: 'camera', src: require('../../assets/icons/camera3.png'), onPress: openCamera },
    { id: 'gallery', src: require('../../assets/icons/gallery.png'), onPress: openGallery },
    { 
      id: 'audio', 
      src: isRecording 
        ? require('../../assets/icons/stop.png') // Replace with stop icon
        : require('../../assets/icons/audio2.png'), // Replace with start icon
      onPress: openAudio 
    },
    { id: 'location', src: require('../../assets/icons/location2.png'), onPress: openLocation },
    { id: 'file', src: require('../../assets/icons/file3.png'), onPress: openFiles },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const currentDate = formattedDate;   
   
    const eventData = { title, mood: selectedMood, note: note || '', date: currentDate, email, bookmark, location: location || '' };

    try {
      let savedEvent;
  
      if (editing) {
        savedEvent = await axios.put(API_ENDPOINTS.UPDATE_EVENT(event._id), eventData);
        // setEditing(false);
      } else {
        savedEvent = await axios.post(API_ENDPOINTS.CREATE_EVENT, eventData);
      }
  
      const eventId = savedEvent.data._id;
  
      // Upload files
      const formData = new FormData();
  
      selectedMedia.forEach((item, index) => {
        if (item.type === 'image/jpeg') {
          formData.append('image', {
            uri: item.uri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`
          });
        } else if (item.type === 'video/mp4') {
          formData.append('video', {
            uri: item.uri,
            type: 'video/mp4',
            name: `video_${index}.mp4`
          });
        }
      });
  
      selectedDocs.forEach((doc, index) => {
        formData.append('documents', {
          uri: doc.uri,
          type: 'application/pdf',
          name: doc.name
        });
      });
  
      if (recordedAudio) {
        console.log("recorded", recordedAudio)
        formData.append('voice', {
          uri: recordedAudio,
          type: 'audio/mpeg',
          name: `audio.mp3`
        });
      }

      formData._parts.forEach(part => {
        console.log(part[0], part[1]);
      });
  
      console.log('Event ID:', eventId);
  
      if (formData._parts.length > 0) {
        await axios.post(API_ENDPOINTS.UPLOAD_FILES(eventId), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        console.log('No files to upload.');
      }
  
      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSaving(false); // Set saving state to false
    }
  };
  
  const handleSelectMood = (index) => {
    dispatch(setEventState({ selectedMood: index }));
    console.log(index);
    // setSelectedMood(index);
  };

  const handleIconPress = (onPress) => {
    onPress(); // Call the respective onPress function
  };

  const handleRemoveMedia = useCallback((index) => {
    dispatch(setEventState({ selectedMedia: selectedMedia.filter((_, i) => i !== index) }));
  }, []);
  
  const handleRemoveDoc = useCallback((index) => {
    dispatch(setEventState({ selectedDocs: selectedDocs.filter((_, i) => i !== index) }));
    // setSelectedDocs((prevDocs) => prevDocs.filter((_, i) => i !== index));
  }, []);

  const mediaDisplay = useMemo(() => (
    <MediaDisplay media={selectedMedia} onRemove={handleRemoveMedia} />
  ), [selectedMedia, handleRemoveMedia]);

  const docDisplay = useMemo(() => (
    <DocDisplay docs={selectedDocs} onRemove={handleRemoveDoc} />
  ), [selectedDocs, handleRemoveDoc]);

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
      // console.log('Fetched items:', items);
      const clustered = clusterByDateAndLocation(items, 1); // 1 km max distance for clustering
      // console.log('Clustered items:', clustered);
      setClusters(clustered);
      setLoading(false);
    };

    loadMedia();
  }, []);

  const handleBookmark  = () => {
    dispatch(setEventState({ bookmark: !bookmark }));
    // setBookmark((prev) => !prev);
  };

  
  useEffect(() => {
    if (route.params && route.params.location) {
      dispatch(setEventState({ location: route.params.location }));
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
            onChangeText={(text) => dispatch(setEventState({ title: text }))}
            multiline
          />
          <TextInput
            style={styles.notesInput}
            placeholder="Journal starts here..."
            value={note}
            onChangeText={(text) => dispatch(setEventState({ note: text }))}
            multiline
          />

          {/* {selectedMedia && selectedMedia.length > 0 && (
            <MediaDisplay media={selectedMedia} onRemove={handleRemoveMedia} />
          )}
          {selectedDocs && selectedDocs.length > 0 && (
            <DocDisplay docs={selectedDocs} onRemove={handleRemoveDoc} />
          )} */}

          {selectedMedia && selectedMedia.length > 0 && mediaDisplay}
          {selectedDocs && selectedDocs.length > 0 && docDisplay}

          <Text>{location}</Text>
        
          <View style={styles.iconContainer}>
            {addOns.map((addOn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleIconPress(addOn.onPress)}
                style={[
                  styles.iconButton,
                  addOn.id === 'audio',
                ]}
              >
                <Image source={addOn.src} style={styles.icon} />
              </TouchableOpacity>
            ))}
          </View>

          {recordedAudio && (
            <AudioPlayer 
              recordedAudio={typeof recordedAudio === 'string' ? recordedAudio : recordedAudio.uri} 
              onDeleteRecordedAudio={onDeleteRecordedAudio} 
            />
          )}

          <TouchableOpacity onPress={toggleRecommendations} style={styles.recommendationsButton}>
            <Text style={styles.recommendationsButtonText}>Show Recommendations</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color={theme.primary} />}
          
        </View>
      </ScrollView>
      <View style={styles.setButtonContainer}>
      <TouchableOpacity style={styles.setButton} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.setButtonText}>{editing ? 'UPDATE EVENT' : 'SAVE'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
            <Image source={bookmark? require('../../assets/icons/bookmark.png') : require('../../assets/icons/bookmark-outline.png')} style={styles.bookmark} tintColor={theme.primary}/>
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
    flexDirection: 'row',
    // display: 'flex',
  },
  setButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
    // width: 250,
    elevation: 3,
    marginHorizontal: 10,
    flex: 4,
  },
  setButtonText: {
    fontSize: 22,
    color: '#ffffff',
  },
  bookmarkButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.primary,
    padding: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 3,
    flex: 1,
  },
  bookmark: {
    height: 35,
    width: 35,

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
  audioControlContainer: {
  padding: 10,
  alignItems: 'center',
  },
  audioControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
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