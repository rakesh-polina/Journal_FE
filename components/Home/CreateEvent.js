import React, { useState, useEffect } from 'react';
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
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import theme from '../../styles/theme';
import { fetchMedia, clusterByDateAndLocation } from './FetchMedia'; // Make sure to import the helper functions
import { parseISO, format, isValid, parse } from 'date-fns';

const mood = [
  { source: require('../../assets/icons/angry.png'), selectedColor: theme.error }, // Red
  { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning }, // Green
  { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary }, // Blue
  { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F' }, // Yellow
  { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080' }, // Magenta
];

// Define your onPress functions
const openCamera = () => {
  console.log('openCamera');
};
const openGallery = () => {
  console.log('openGallery');
};
const openAudio = () => {
  console.log('openAudio');
};
const openLocation = () => {
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

function CreateEvent() {
  const [selectedMood, setSelectedMood] = useState(2);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

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
            multiline
          />

          <TextInput
            style={styles.notesInput}
            placeholder="Journal starts here..."
            multiline
          />
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

          <TouchableOpacity onPress={toggleRecommendations} style={styles.recommendationsButton}>
            <Text style={styles.recommendationsButtonText}>Show Recommendations</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color={theme.primary} />}
          
        </View>
      </ScrollView>
      <View style={styles.setButtonContainer}>
        <TouchableOpacity style={styles.setButton}>
          <Text style={styles.setButtonText}>SAVE</Text>
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
    elevation: 5,
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