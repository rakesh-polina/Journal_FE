import React, { useState, useEffect, useCallback, useRoute, useRef } from 'react';
import axios from 'axios';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
  Animated, 
  PanResponder,
  ActivityIndicator
} from 'react-native';
import debounce from 'lodash.debounce';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../src/config';

import Event from '../cards/event';
import theme from '../../styles/theme';
import storage from '../../src/storage';
import ExCalendar from './ExCalendar';

function Home({navigation, route}) {
  const  email  = route.params.email;
  const [markedDates, setMarkedDates] = useState({});
  const [ date, setDate] = useState(new Date());
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchEvents = useCallback(async () => {
    setLoading(true); // Start loading
    const formattedDate =  formatDate(date);
    console.log(formattedDate);
    try {
      const result = await axios.get(API_ENDPOINTS.GET_EVENTS_BY_DATE(email, formattedDate));
      // console.log(result.data);
      setEvents(result.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Optionally set an error state here
    } finally {
      setLoading(false); // Stop loading
    }
  }, [email, date]);

  const getMarkedDates = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DATES_MODE(email));
      const data = response.data;
  
      const moodColors = {
        0: 'red',
        1: 'orange',
        2: 'blue',
        3: 'yellow',
        4: 'pink'
      };
  
      const markedDates = data.reduce((acc, { _id: date, mood }) => {
        acc[date] = { marked: true, dotColor: moodColors[mood] };
        return acc;
      }, {});

      // console.log(markedDates);

      const transformed = {};
  
      Object.keys(markedDates).forEach((key) => {
        const date = new Date(key);
        const formattedDate = date.toISOString().split('T')[0];
        transformed[formattedDate] = {
          marked: markedDates[key].marked,
          dotColor: markedDates[key].dotColor
        };
      });
// console.log(transformed);
setMarkedDates(transformed);
  
      // return markedDates;
    } catch (error) {
      console.error('Error fetching marked dates:', error);
      setMarkedDates({});
    }
  }, [email]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    getMarkedDates();
  }, [getMarkedDates]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const handleEdit = (event) => {
    navigation.navigate('CreateEvent', { 
      email, 
      event 
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(API_ENDPOINTS.DELETE_EVENT(id));
    fetchReminders();
  };

  const formatDate = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;
    return formattedDate

  }

  const toggleFilters = useCallback(() => {
    console.log('filter');
  }, []);

  // useCallback ensures that the function is memoized and does not change on every render
  const toggleSearchBar = useCallback(() => {
    setIsSearchVisible(prev => !prev);
  }, []);

  useEffect(() => {
    // This will only set the params once when the component mounts
    navigation.setParams({ toggleSearchBar });
  }, [navigation, toggleSearchBar]);

  
  return (
    <SafeAreaView style={styles.safeArea}>
      {isSearchVisible && (
         <View style={styles.searchContainer}>
         <TextInput
           style={styles.searchBar}
           placeholder="Search..."
           // Add any additional props or state management for search functionality
         />
         <TouchableOpacity onPress={toggleFilters} style={styles.searchIcon}>
           <Image source={require('../../assets/icons/filter2.png')} style={styles.icon} />
         </TouchableOpacity>
       </View>
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContainer}>

      <ExCalendar onDateChange={setDate} markedDates={markedDates} style={styles.exCalendar} />
         
        <View style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#00aaff" />
          ) : (
            events.map(event => (
              <Event 
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
      </ScrollView>
      <View style={styles.addContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Image source={require('../../assets/icons/plus.png')} style={{tintColor:'#fff'}}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  exCalendar:{
    // position: 'absolute'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    padding: 10,
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
  calendarContainer: {
    height: 300,  // Adjust this height as per your requirement
  },
  knobContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    width: 40,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
});


export default Home;
