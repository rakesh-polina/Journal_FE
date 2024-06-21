import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { API_ENDPOINTS } from '../../src/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ReminderCard from '../cards/reminderCard';
import theme from '../../styles/theme';
import SearchHeader from '../Home/SearchHeader';
import debounce from 'lodash/debounce';


const Reminder = ({ route }) => {
  const { email } = route.params;

  //search variables
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();

  const fetchReminders = async () => {
    const result = await axios.get(API_ENDPOINTS.REMINDERS(email));
    setReminders(result.data);
  };

  const searchAPI = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH_REMINDER(email), {q: searchQuery});
      setReminders(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the searchAPI function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      searchAPI(searchQuery);
    }, 300), // 300 milliseconds delay
    []
  );

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      fetchReminders();
    }
    // Cancel the debounce on useEffect cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // useEffect(() => {
  //   fetchReminders();
  // }, [email]);

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

  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchHeader componentName="Remainder" toggleSearchBar={toggleSearchBar}/>
      {isSearchVisible ? (<View style={styles.searchContainer}>
            <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            // Add any additional props or state management for search functionality
            />
          
            </View>) : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {reminders.map(reminder => (
     
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

  //SEARCH BAR
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
  searchBar: {
    flex: 1,
    height: 40,
  },
});

export default Reminder;