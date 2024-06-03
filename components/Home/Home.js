import React, { useState, useEffect, useCallback, useRoute, useRef } from 'react';
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
  PanResponder
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Event from '../cards/event';
import theme from '../../styles/theme';
// import {Calendar,Agenda, ExpandableCalendar, CalendarProvider} from 'react-native-calendars';
import ExCalendar from './ExCalendar';

function Home({navigation, route}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  // const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // const panY = useRef(new Animated.Value(0)).current;
  // const route = useRoute();

  // const toggleSearchBar = () => {
  //   console.log('searchh');
  //   setIsSearchVisible(!isSearchVisible);
  // };

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

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: (_, gestureState) => {
  //       return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
  //     },
  //     onPanResponderMove: Animated.event(
  //       [null, { dy: panY }],
  //       { useNativeDriver: false }
  //     ),
  //     onPanResponderRelease: (_, gestureState) => {
  //       if (gestureState.dy > 100) {
  //         // Swiped down to open calendar
  //         Animated.timing(panY, {
  //           toValue: 100,  // Adjust as per the height of ExCalendar
  //           duration: 300,
  //           useNativeDriver: false,
  //         }).start(() => {
  //           setIsCalendarVisible(true);
  //         });
  //       } else if (gestureState.dy < -100) {
  //         // Swiped up to close calendar
  //         Animated.timing(panY, {
  //           toValue: 0,
  //           duration: 300,
  //           useNativeDriver: false,
  //         }).start(() => {
  //           setIsCalendarVisible(false);
  //         });
  //       } else {
  //         // Reset position if swipe distance is not sufficient
  //         Animated.spring(panY, {
  //           toValue: isCalendarVisible ? 200 : 0,
  //           useNativeDriver: false,
  //         }).start();
  //       }
  //     },
  //   })
  // ).current;
  
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
          <ExCalendar />
         {/* {isCalendarVisible ? (
          <View>
            <Animated.View 
            style={[styles.knobContainer, { transform: [{ translateY: panY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.knob} />
          </Animated.View>

          </View>
        ) : (
          <Animated.View 
            style={[styles.knobContainer, { transform: [{ translateY: panY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.knob} />
          </Animated.View>
        )} */}
        
        <View style={styles.container}>
          <Event/>
          {/* <Event 
              // key={reminder._id}
              // reminder={reminder}
              // onEdit={handleEdit}
              // onDelete={handleDelete}
            /> */}
        </View>
      </ScrollView>
      <View style={styles.addContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('CreateEvent')}
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
  },
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  // sectionContainer: {
  //   marginTop: 32,
  //   paddingHorizontal: 24,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
  // searchBar: {
  //   height: 40,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 20,
  //   paddingHorizontal: 10,
  //   margin: 10,
  // },
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
