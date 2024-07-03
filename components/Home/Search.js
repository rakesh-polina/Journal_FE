import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Alert,
  View,
} from 'react-native';
import theme from '../../styles/theme';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { API_ENDPOINTS } from '../../src/config';
import Event from '../cards/event';


function Search({navigation,route}) {
  const { email } = route.params;

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [isVoice, setIsVoice] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState([]);

  const [query, setQuery] = useState('');
  const [events, setEvents] = useState([]);

  const mood = [
    { source: require('../../assets/icons/angry.png'), selectedColor: theme.error, id: 0 }, // Red
    { source: require('../../assets/icons/sad.png'), selectedColor: theme.warning, id: 1 }, // Green
    { source: require('../../assets/icons/smile.png'), selectedColor: theme.primary, id: 2 }, // Blue
    { source: require('../../assets/icons/happy.png'), selectedColor: '#F1C40F', id: 3 }, // Yellow
    { source: require('../../assets/icons/heart.png'), selectedColor: '#F08080', id: 4 }, // Magenta
  ];

  const handleEdit = (event) => {
    navigation.navigate('CreateEvent', { 
      email, 
      event 
    });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            await axios.delete(API_ENDPOINTS.DELETE_EVENT(id));
            fetchEvents();
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const toggleFilters = useCallback(() => {
    setFiltersVisible((prev) => !prev);
  }, []);

  const toggleMoodSelection = (id) => {
    setSelectedMoods((prev) => {
      if (prev.includes(id)) {
        return prev.filter((moodId) => moodId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleImage = () => setIsImage((prev) => !prev);
  const toggleVoice = () => setIsVoice((prev) => !prev);
  const toggleFile = () => setIsFile((prev) => !prev);

  // Function to handle the backend call
  const searchAPI = async (searchQuery, moods, images, voice, files) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SEARCH_EVENTS(email), {
        q: searchQuery,
        mood: moods,
        images: images,
        voice: voice,
        documents: files
      });
      setEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  // Debounce the searchAPI function
  const debouncedSearch = useCallback(
    debounce((searchQuery, moods, images, voice, files) => {
      searchAPI(searchQuery, moods, images, voice, files);
    }, 1000), // 300 milliseconds delay
    [query, selectedMoods, isImage, isVoice, isFile, debouncedSearch]
  );

  // Effect to handle search input and filter changes
  useEffect(() => {
    debouncedSearch(query, selectedMoods, isImage, isVoice, isFile);
    // console.log("searxh");
    // console.log(query, selectedMoods, isImage, isVoice, isFile);

    // Cancel the debounce on useEffect cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, selectedMoods, isImage, isVoice, isFile, debouncedSearch]);


  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
          // Add any additional props or state management for search functionality
        />
        <TouchableOpacity onPress={toggleFilters} style={styles.searchIcon}>
          <Image source={require('../../assets/icons/filter2.png')} />
        </TouchableOpacity>
      </View>
      {filtersVisible && (
        <View style={styles.filterContainer}>
          <View style={styles.moodContainer}>
            {mood.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.moodCheckbox}
                onPress={() => toggleMoodSelection(item.id)}
              >
                <Image
                  source={item.source}
                  style={[
                    styles.moodIcon,
                    { tintColor: selectedMoods.includes(item.id) ? item.selectedColor : theme.greyMedium },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.additionalFilters}>
            <View style={styles.filterItem}>
              <Text>Images</Text>
              <TouchableOpacity style={styles.checkbox} onPress={toggleImage}>
                {isImage && <View style={styles.checkboxSelected} />}
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <Text>Voice</Text>
              <TouchableOpacity style={styles.checkbox} onPress={toggleVoice}>
                {isVoice && <View style={styles.checkboxSelected} />}
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <Text>Documents</Text>
              <TouchableOpacity style={styles.checkbox} onPress={toggleFile}>
                {isFile && <View style={styles.checkboxSelected} />}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={toggleFilters} style={styles.setFilterButton}>
            <Text style={styles.setFilterText}>Set Filter</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.eventContainer}>
          {events.map(event => (
              <Event 
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              ))}
        </View>
      </ScrollView>      
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    borderColor: theme.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
    position: 'relative',
    
  },
  eventContainer: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  filterContainer: {
    borderColor: theme.primary,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  moodCheckbox: {
    padding: 5,
  },
  moodIcon: {
    width: 40,
    height: 40,
  },
  additionalFilters: {
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: theme.greyMedium,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 14,
    height: 14,
    backgroundColor: theme.primary,
  },
  setFilterButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderColor: theme.primary,
    borderWidth: 1,
  },
  setFilterText: {
    color: theme.primary,
    fontWeight: 'bold',
  },
});

export default Search;
