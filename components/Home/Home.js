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
  Alert,
  Animated, 
  PanResponder,
  ActivityIndicator
} from 'react-native';
import debounce from 'lodash.debounce';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setEventState, resetEventState } from '../../src/slices/eventSlice';
import { API_ENDPOINTS } from '../../src/config';

import Event from '../cards/event';
import theme from '../../styles/theme';
import storage from '../../src/storage';
import ExCalendar from './ExCalendar';
import SearchHeader from './SearchHeader';
// import SearchHeader from './SearchHeader';

function Home({navigation, route}) {
  const  email  = route.params.email;
  const [markedDates, setMarkedDates] = useState({});
  const [ date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  // const formattedDate =  formatDate(date);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(resetEventState());
    });

    return unsubscribe;
  }, [dispatch, navigation]);

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
        0: theme.error,
        1: theme.warning,
        2: 'blue',
        3: '#F1C40F',
        4: '#F08080'
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

  const handleAddEvent = () => {
    const formattedDate = formatDate(date);
    navigation.navigate('CreateEvent', { email, formattedDate });
  };

  const handleEdit = (event) => {
    navigation.navigate('CreateEvent', { 
      email, 
      event 
    });
  };

  // const handleDelete = async (id) => {
  //   await axios.delete(API_ENDPOINTS.DELETE_EVENT(id));
  //   fetchEvents();
  // };

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

  const formatDate = (date) => {
    const currentDate = new Date(date);
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;
    return formattedDate

  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchHeader componentName="Home"/>
      {/* <View style={styles.container}>
        <View style={styles.calendar}>
        </View>
        <View style={styles.divider}> */}

          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollContainer}>

          <ExCalendar onDateChange={setDate} markedDates={markedDates} style={styles.exCalendar} />
            
            <View style={styles.eventContainer}>
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

        {/* </View>
      </View> */}
      <View style={styles.addContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddEvent}
          // onPress={() => navigation.navigate('CreateEvent', { email })}
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
  eventContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  container:{
    // marginTop: 15,
    flex: 1,
    justifyContent: 'flex-start',
    // padding: 20,
    // position: 'relative',
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  calendar:{
    flex: 1,
    position: 'relative',
    borderColor: '#000',
    borderWidth: 1,
  },

  divider:{
    flex: 2,
    // display: 'flex',
    // position: 'relative',
    borderColor: '#000',
    borderWidth: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
    position: 'relative',
    
  },
  exCalendar:{
  },

  addContainer: {
    // flex: 1,
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
